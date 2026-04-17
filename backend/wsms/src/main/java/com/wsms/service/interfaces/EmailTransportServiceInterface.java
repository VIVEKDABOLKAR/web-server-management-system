package com.wsms.service.interfaces;

import org.springframework.mail.SimpleMailMessage;

public interface EmailTransportServiceInterface {

    void send(SimpleMailMessage message);
}