package com.wsms.service;

import java.util.Map;

import com.wsms.entity.UserStatus;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.wsms.dto.auth.AuthResponse;
import com.wsms.dto.auth.LoginRequest;
import com.wsms.dto.auth.SignupRequest;
import com.wsms.entity.User;
import com.wsms.entity.UserRole;
import com.wsms.repository.UserRepository;
import com.wsms.security.JwtService;
import com.wsms.service.interfaces.AuthServiceInterface;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService implements AuthServiceInterface {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final SignupVerificationService signupVerificationService;

    @Value("${app.auth.signup.auto-verify-on-email-failure:false}")
    private boolean autoVerifyOnEmailFailure;

    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is already registered");
        }

        User user = User.builder()
                .email(request.getEmail())
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(UserRole.USER)
                .isVerified(false)
                .verificationToken(null)
                .build();

        userRepository.save(user);

        try {
            signupVerificationService.sendVerificationCode(user);

            return AuthResponse.builder()
                    .message("Signup successful, verification code sent to your email")
                    .token(null)
                    .build();
        } catch (EmailServiceDownException ex) {
            if (!autoVerifyOnEmailFailure) {
                throw ex;
            }

            user.setVerified(true);
            user.setVerificationToken("true");
            userRepository.save(user);

            return AuthResponse.builder()
                    .message("Signup successful. Email service is down, account auto-verified")
                    .token(null)
                    .build();
        }
    }

    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (AuthenticationException ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        if (user.getStatus() == UserStatus.BLOCKED) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User is blocked");
        }

        if (!Boolean.TRUE.equals(user.isVerified())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Email not verified");
        }

        String token = jwtService.generateToken(
                user.getEmail(),
                Map.of("role", user.getRole().name())
        );

        return AuthResponse.builder()
                .message("Login successful")
                .token(token)
                .build();
    }
}
