package com.wsms.exception.email;

public class EmailServiceNotFoundException extends RuntimeException {

    public EmailServiceNotFoundException(String message) {
        super(message);
    }
}