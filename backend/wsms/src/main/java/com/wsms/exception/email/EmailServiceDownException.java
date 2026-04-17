package com.wsms.exception.email;

public class EmailServiceDownException extends RuntimeException {

    public EmailServiceDownException(String message) {
        super(message);
    }
}