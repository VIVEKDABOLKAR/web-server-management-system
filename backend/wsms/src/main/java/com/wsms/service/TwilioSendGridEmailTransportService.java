package com.wsms.service;

import com.wsms.exception.email.EmailServiceDownException;
import com.wsms.exception.email.EmailServiceNotFoundException;
import com.wsms.service.interfaces.EmailTransportServiceInterface;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@Profile("prod")
@RequiredArgsConstructor
public class TwilioSendGridEmailTransportService implements EmailTransportServiceInterface {

    @Value("${twilio.sendgrid.api-key:}")
    private String apiKey;

    @Value("${twilio.sendgrid.base-url:https://api.sendgrid.com}")
    private String baseUrl;

    @Value("${app.mail.from:dabolkarvivek@gmail.com}")
    private String from;

    private RestClient restClient;

    @PostConstruct
    void init() {
        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .build();
    }

    @Override
    public void send(SimpleMailMessage message) {
        validateConfiguration();

        String[] toRecipients = message.getTo();
        if (toRecipients == null || toRecipients.length == 0) {
            throw new EmailServiceNotFoundException("Email service configuration not found");
        }

        List<Map<String, String>> to = new ArrayList<>();
        for (String recipient : toRecipients) {
            Map<String, String> recipientPayload = new HashMap<>();
            recipientPayload.put("email", recipient);
            to.add(recipientPayload);
        }

        Map<String, Object> payload = new HashMap<>();

        Map<String, Object> personalization = new HashMap<>();
        personalization.put("to", to);
        payload.put("personalizations", List.of(personalization));

        Map<String, String> fromPayload = new HashMap<>();
        fromPayload.put("email", from);
        payload.put("from", fromPayload);
        payload.put("subject", message.getSubject());

        Map<String, String> content = new HashMap<>();
        content.put("type", "text/plain");
        content.put("value", message.getText());
        payload.put("content", List.of(content));

        try {
            log.debug("Sending email via Twilio SendGrid API - from: {}, to: {}", from, toRecipients.length);
            restClient.post()
                    .uri("/v3/mail/send")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey.trim())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(payload)
                    .retrieve()
                    .toBodilessEntity();
            log.info("Email sent successfully via Twilio SendGrid API");
        } catch (RestClientException ex) {
            log.error("Twilio SendGrid API error: {}", ex.getMessage(), ex);
            throw new EmailServiceDownException("Email service is temporarily unavailable: " + ex.getMessage());
        }
    }

    private void validateConfiguration() {
        if (!StringUtils.hasText(apiKey) || !StringUtils.hasText(from)) {
            throw new EmailServiceNotFoundException("Email service configuration not found");
        }
    }
}