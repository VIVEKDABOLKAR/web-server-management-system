package com.wsms.aop.controller;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

@Aspect
@Component
@Slf4j
public class ServerControllerAspect {



    /**
     * log before calling any server endpoint
     */
    @Before(value = "execution(* com.wsms.controller.*.*(..))")
    public void logBefore(JoinPoint joinPoint) {
        log.debug("Entering Method: " + joinPoint.getSignature().getName());
    }
}
