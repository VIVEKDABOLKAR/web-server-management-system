package com.wsms.service;

import com.wsms.entity.Alert;
import com.wsms.exception.email.EmailServiceDisableException;
import com.wsms.exception.email.EmailServiceNotFoundException;
import com.wsms.service.interfaces.EmailServiceInterface;
import com.wsms.service.interfaces.EmailTransportServiceInterface;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class EmailService implements EmailServiceInterface {

    private final EmailTransportServiceInterface emailTransportService;
    private final AppConfigService appConfigService;

    @Value("${app.mail.from}")
    private String from;

    /**
     * sendMail Helper Function
     *
     */
    public void sendEmail(String to, String subject, String body) {
        validateEmailServiceConfigured();
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);

        sendEmail(message);
    }

    public void sendEmail(SimpleMailMessage message) {
        validateEmailServiceConfigured();
        emailTransportService.send(message);
    }

    public void sendAlert(Alert alert, String email, String severity) {
        if (!appConfigService.isEmailServiceEnabled()) {
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

        if (!appConfigService.isEmailServiceEnabled()) {
            System.out.println("[EMAIL DISABLED] OTP for " + to + ": " + otp);
            throw new EmailServiceDisableException("Email service is disabled By Administrator");
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);

        sendEmail(message);
    }

    public void sendVerificationOtp(String to, String otp) {
        String subject = "WSMS Email Verification Code";
        String text = "Your verification code is: " + otp + "\n\nThis code will expire in 10 minutes.";

        if (!appConfigService.isEmailServiceEnabled()) {
            System.out.println("[EMAIL DISABLED] Verification OTP for " + to + ": " + otp);
            throw new EmailServiceDisableException("Email service is disabled By Administrator");
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);

        sendEmail(message);
    }

    private void validateEmailServiceConfigured() {
        if (!StringUtils.hasText(from)) {
            throw new EmailServiceNotFoundException("Email service configuration not found");
        }
    }
}

