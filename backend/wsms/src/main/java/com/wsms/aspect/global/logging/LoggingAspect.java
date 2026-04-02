package com.wsms.aspect.global.logging;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;

import org.springframework.stereotype.Component;

@Component
@Aspect
@Slf4j
public class LoggingAspect {

    @Around("execution(* com.wsms.controller..*(..))")
    public Object around(ProceedingJoinPoint joinPoint) throws Throwable {

        long start = System.currentTimeMillis();

        String className = joinPoint.getSignature().getDeclaringTypeName();
        String methodName = joinPoint.getSignature().getName();


        try {
            Object result = joinPoint.proceed();

            long duration = System.currentTimeMillis() - start;

            log.info(
                    "event=controller_call layer=controller class={} method={}  outcome=SUCCESS statusCode={} durationMs={} message=\"Success\"",
                    className, methodName, 200, duration
            );

            return result;

        } catch (Exception ex) {

            long duration = System.currentTimeMillis() - start;

            log.error(
                    "event=controller_call layer=controller class={} method={} outcome=FAILURE statusCode={} durationMs={} errorType={} message=\"{}\"",
                    className,
                    methodName,
                    500,
                    duration,
                    ex.getClass().getSimpleName(),
                    ex.getMessage()
            );

            throw ex;
        }
    }
}
