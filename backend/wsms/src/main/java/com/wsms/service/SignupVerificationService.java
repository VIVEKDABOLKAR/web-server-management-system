package com.wsms.service;

import com.wsms.entity.OtpPurpose;
import com.wsms.entity.User;
import com.wsms.entity.VerificationOtp;
import com.wsms.repository.UserRepository;
import com.wsms.repository.VerificationOtpRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class SignupVerificationService {

    private final UserRepository userRepository;
    private final VerificationOtpRepository tokenRepository;
    private final EmailService emailService;

    private static final int OTP_EXPIRATION_MINUTES = 10;

    public Map<String, String> sendVerificationCode(User user) {
        String otp = generateOtp();
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(OTP_EXPIRATION_MINUTES);

        VerificationOtp token = VerificationOtp.builder()
                .user(user)
                .purpose(OtpPurpose.SIGNUP)
                .otp(otp)
                .expiresAt(expiresAt)
                .used(false)
                .build();

        tokenRepository.save(token);
        emailService.sendVerificationOtp(user.getEmail(), otp);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Verification code sent to email");
        return response;
    }

    public Map<String, String> verifyOtp(String email, String otp) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        VerificationOtp token = tokenRepository.findByUserAndOtpAndPurposeAndUsedFalse(user, otp, OtpPurpose.SIGNUP)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid OTP"));

        if (token.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "OTP has expired");
        }

        user.setVerified(true);
        userRepository.save(user);

        token.setUsed(true);
        tokenRepository.save(token);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Email verified successfully");
        return response;
    }

    private String generateOtp() {
        Random random = new Random();
        int number = random.nextInt(900000) + 100000;
        return String.valueOf(number);
    }
}
