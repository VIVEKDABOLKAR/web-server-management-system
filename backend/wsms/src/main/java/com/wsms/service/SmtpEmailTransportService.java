package com.wsms.service;

import com.wsms.exception.email.EmailServiceDownException;
import com.wsms.service.interfaces.EmailTransportServiceInterface;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Profile;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@Profile("dev")
@Qualifier("smtp")
@RequiredArgsConstructor
public class SmtpEmailTransportService implements EmailTransportServiceInterface {

    private final JavaMailSender mailSender;

    @Override
    public void send(SimpleMailMessage message) {
        try {
            mailSender.send(message);
        } catch (MailException ex) {
            throw new EmailServiceDownException("Email service is temporarily unavailable");
        }
    }
}