package com.wsms.service;

import com.wsms.entity.Alert;
import com.wsms.entity.AlertType;
import com.wsms.entity.Server;
import com.wsms.entity.User;
import com.wsms.exception.email.EmailServiceDisableException;
import com.wsms.service.interfaces.EmailServiceInterface;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService implements EmailServiceInterface {

    private final JavaMailSender mailSender;
    private final AdminRuntimeConfigService adminRuntimeConfigService;

    @Value("${app.mail.from}")
    private String from;

    /**
     * sendMail Helper Function
     *
     */
    public void sendEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);

        sendEmail(message);
    }
    public void sendEmail(SimpleMailMessage message) {
        mailSender.send(message);
    }

    public void sendAlert(Alert alert, String email, String severity) {
        if (!adminRuntimeConfigService.isEmailServiceEnabled()) {
            System.out.println("[EMAIL DISABLED] Alert :- " + alert.getMessage());
            //throw error
            throw new EmailServiceDisableException("Email service is disabled By Administrator");
        }

        String subject = "WSMS :- ALERT OCCURED -- " + alert.getMessage();

        String body = """
            Dear User,

            An alert has been triggered in your WSMS monitoring system.

            Alert Details:
            -----------------------------------
            Server      : %s
            Message     : %s
            Time        : %s
            Severity    : %s
            -----------------------------------

            Please review the system as soon as possible.

            Regards,
            WSMS Monitoring System
            """.formatted(
                alert.getServer().getServerName(),
                alert.getMessage(),
                alert.getCreatedAt(),
                severity
        );

        sendEmail(email, subject, body);
    }

    public void sendOtp(String to, String otp) {
        String subject = "WSMS Password Reset Code";
        String text = "Your password reset code is: " + otp + "\n\nThis code will expire in 1 minute.";

        if (!adminRuntimeConfigService.isEmailServiceEnabled()) {
            System.out.println("[EMAIL DISABLED] OTP for " + to + ": " + otp);
            throw new EmailServiceDisableException("Email service is disabled By Administrator");
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

        if (!adminRuntimeConfigService.isEmailServiceEnabled()) {
            System.out.println("[EMAIL DISABLED] Verification OTP for " + to + ": " + otp);
            throw new EmailServiceDisableException("Email service is disabled By Administrator");
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);

        mailSender.send(message);
    }
}

