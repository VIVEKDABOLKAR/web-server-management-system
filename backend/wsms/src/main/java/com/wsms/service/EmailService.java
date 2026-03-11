package com.wsms.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.enabled:false}")
    private boolean mailEnabled;

    @Value("${app.mail.from:no-reply@example.com}")
    private String from;

    public void sendOtp(String to, String otp) {
        String subject = "WSMS Password Reset Code";
        String text = "Your password reset code is: " + otp + "\n\nThis code will expire in 1 minute.";

        if (!mailEnabled) {
            System.out.println("[EMAIL DISABLED] OTP for " + to + ": " + otp);
            return;
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);

        mailSender.send(message);
    }

    public void sendVerificationOtp(String to, String otp) {
        String subject = "WSMS Email Verification Code";
        String text = "Your verification code is: " + otp + "\n\nThis code will expire in 10 minutes.";

        if (!mailEnabled) {
            System.out.println("[EMAIL DISABLED] Verification OTP for " + to + ": " + otp);
            return;
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);

        mailSender.send(message);
    }
}

