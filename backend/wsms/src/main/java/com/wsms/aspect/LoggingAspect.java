package com.wsms.aspect;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@Aspect
public class LoggingAspect {

    @Before("execution(*  com.wsms.controller.AuthController.*(..))")
    public void beforeLog(JoinPoint joinPoint){
        log.info("Entering Method: " + joinPoint.getSignature().getName());
    }

}
