package com.wsms.exception.email;

public class EmailServiceDisableException extends  RuntimeException{

    public EmailServiceDisableException(String message){
        super(message);
    }
}
