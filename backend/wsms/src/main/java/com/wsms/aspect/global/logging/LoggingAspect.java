package com.wsms.aspect.global.logging;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;

import org.slf4j.MDC;
import org.springframework.stereotype.Component;

@Component
@Aspect
@Slf4j
public class LoggingAspect {

    @Around("execution(* com.wsms.controller..*(..))")
    public Object aroundController(ProceedingJoinPoint joinPoint) throws Throwable {

        long start = System.currentTimeMillis();

        String className = joinPoint.getSignature().getDeclaringTypeName();
        String methodName = joinPoint.getSignature().getName();

        String traceId = MDC.get("traceId");
        String requestId = MDC.get("requestId");


        try {
            Object result = joinPoint.proceed();

            long duration = System.currentTimeMillis() - start;

            log.info(
                    "traceId={} requestId={} event=controller_call layer=controller class={} method={}  outcome=SUCCESS statusCode={} durationMs={} message=\"Success\"",
                    traceId, requestId, className, methodName, 200, duration
            );

            return result;

        } catch (Exception ex) {

            long duration = System.currentTimeMillis() - start;

            log.error(
                    "traceId={} requestId={} event=controller_call layer=controller class={} method={} outcome=FAILURE statusCode={} durationMs={} errorType={} message=\"{}\"",
                    traceId,
                    requestId,
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

    @Around("execution(* com.wsms.service..*(..))")
    public Object aroundService(ProceedingJoinPoint joinPoint) throws Throwable {

        long start = System.currentTimeMillis();

        String className = joinPoint.getSignature().getDeclaringTypeName();
        String methodName = joinPoint.getSignature().getName();

        String traceId = MDC.get("traceId");
        String requestId = MDC.get("requestId");


        try {
            Object result = joinPoint.proceed();

            long duration = System.currentTimeMillis() - start;

            log.info(
                    "traceId={} requestId={} event=service_call layer=service class={} method={} outcome=SUCCESS statusCode={} durationMs={} message=\"Success\"",
                    traceId, requestId, className, methodName, 200, duration
            );

            return result;

        } catch (Exception ex) {

            long duration = System.currentTimeMillis() - start;

            log.error(
                    "traceId={} requestId={} event=service_call layer=service class={} method={} outcome=FAILURE statusCode={} durationMs={} errorType={} message=\"{}\"",
                    traceId,
                    requestId,
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

    @Around("execution(* com.wsms.repository..*(..))")
    public Object aroundRepository(ProceedingJoinPoint joinPoint) throws Throwable {

        long start = System.currentTimeMillis();

        String className = joinPoint.getSignature().getDeclaringTypeName();
        String methodName = joinPoint.getSignature().getName();

        String traceId = MDC.get("traceId");
        String requestId = MDC.get("requestId");


        try {
            Object result = joinPoint.proceed();

            long duration = System.currentTimeMillis() - start;

            log.info(
                    "traceId={} requestId={} event=repository_call layer=repository class={} method={} outcome=SUCCESS statusCode={} durationMs={} message=\"Success\"",
                    traceId, requestId, className, methodName, 200, duration
            );

            return result;

        } catch (Exception ex) {

            long duration = System.currentTimeMillis() - start;

            log.error(
                    "traceId={} requestId={} event=repository_call layer=repository class={} method={} outcome=FAILURE statusCode={} durationMs={} errorType={} message=\"{}\"",
                    traceId,
                    requestId,
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
