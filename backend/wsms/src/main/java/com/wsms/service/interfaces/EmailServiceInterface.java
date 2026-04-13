package com.wsms.service.interfaces;

import com.wsms.entity.Alert;
import org.springframework.mail.SimpleMailMessage;

public interface EmailServiceInterface {

    void sendEmail(String to, String subject, String body);

    void sendEmail(SimpleMailMessage message);

    void sendAlert(Alert alert, String email, String severity);

    void sendOtp(String to, String otp);

    void sendVerificationOtp(String to, String otp);
}
