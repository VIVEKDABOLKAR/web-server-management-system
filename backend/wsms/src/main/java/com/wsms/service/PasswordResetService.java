package com.wsms.service;

import com.wsms.entity.OtpPurpose;
import com.wsms.entity.User;
import com.wsms.entity.VerificationOtp;
import com.wsms.repository.UserRepository;
import com.wsms.repository.VerificationOtpRepository;
import com.wsms.service.interfaces.PasswordResetServiceInterface;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class PasswordResetService implements PasswordResetServiceInterface {

    private final UserRepository userRepository;
    private final VerificationOtpRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    private static final int OTP_EXPIRATION_MINUTES = 2;

    public Map<String, String> requestPasswordReset(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        String otp = generateOtp();
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(OTP_EXPIRATION_MINUTES);

        VerificationOtp token = VerificationOtp.builder()
                .user(user)
                .purpose(OtpPurpose.PASSWORD_RESET)
                .otp(otp)
                .expiresAt(expiresAt)
                .used(false)
                .build();

        tokenRepository.save(token);
        emailService.sendOtp(user.getEmail(), otp);

        Map<String, String> response = new HashMap<>();
        response.put("message", "OTP sent to email if it exists");
        return response;
    }

    public Map<String, String> verifyOtp(String email, String otp) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        VerificationOtp token = tokenRepository.findByUserAndOtpAndPurposeAndUsedFalse(user, otp, OtpPurpose.PASSWORD_RESET)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid OTP"));

        if (token.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "OTP has expired");
        }

        Map<String, String> response = new HashMap<>();
        response.put("message", "OTP is valid");
        return response;
    }

    public Map<String, String> resetPassword(String email, String otp, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        VerificationOtp token = tokenRepository.findByUserAndOtpAndPurposeAndUsedFalse(user, otp, OtpPurpose.PASSWORD_RESET)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid OTP"));

        if (token.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "OTP has expired");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        token.setUsed(true);
        tokenRepository.save(token);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Password reset successful");
        return response;
    }

    private String generateOtp() {
        Random random = new Random();
        int number = random.nextInt(900000) + 100000;
        return String.valueOf(number);
    }
}
