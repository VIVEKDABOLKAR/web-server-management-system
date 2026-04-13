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

    private static final String DEFAULT_TRACE_ID = "NO_TRACE";
    private static final String DEFAULT_REQUEST_ID = "NO_REQUEST";

    /**
     * around aspect for logs of controller
     * 
     * @param joinPoint
     * @return
     * @throws Throwable
     */
    @Around("execution(* com.wsms.controller..*(..))")
    public Object aroundController(ProceedingJoinPoint joinPoint) throws Throwable {

        String traceId = resolveTraceId();
        String requestId = resolveRequestId();

        long start = System.currentTimeMillis();

        String className = joinPoint.getSignature().getDeclaringTypeName();
        String methodName = joinPoint.getSignature().getName();

        log.info(
                "traceId={} requestId={} event=controller_call stage=ENTRY layer=controller class={} method={} message=\"Started\"",
                traceId, requestId, className, methodName);

        try {
            Object result = joinPoint.proceed();

            long duration = System.currentTimeMillis() - start;

            log.info(
                    "traceId={} requestId={} event=controller_call stage=EXIT layer=controller class={} method={}  outcome=SUCCESS statusCode={} durationMs={} message=\"Success\"",
                    traceId, requestId, className, methodName, 200, duration);

            return result;

        } catch (Throwable ex) {

            long duration = System.currentTimeMillis() - start;

            log.error(
                    "traceId={} requestId={} event=controller_call stage=EXIT layer=controller class={} method={} outcome=FAILURE statusCode={} durationMs={} errorType={} message=\"{}\"",
                    traceId,
                    requestId,
                    className,
                    methodName,
                    500,
                    duration,
                    ex.getClass().getSimpleName(),
                    ex.getMessage());

            throw ex;
        }
    }

    /**
     * around aspect for logs of controller
     * 
     * @param joinPoint
     * @return
     * @throws Throwable
     */
    @Around("execution(* com.wsms.service..*(..))")
    public Object aroundService(ProceedingJoinPoint joinPoint) throws Throwable {

        long start = System.currentTimeMillis();

        String className = joinPoint.getSignature().getDeclaringTypeName();
        String methodName = joinPoint.getSignature().getName();

        String traceId = resolveTraceId();
        String requestId = resolveRequestId();

        // TODO :- this is not production grid, later we will print this log into
        // internal call
        // for now we are just ignoring internally calls
        if (traceId == DEFAULT_TRACE_ID || requestId == DEFAULT_REQUEST_ID) {
            return joinPoint.proceed();
        }

        log.info(
                "traceId={} requestId={} event=service_call stage=ENTRY layer=service class={} method={} message=\"Started\"",
                traceId, requestId, className, methodName);

        try {
            Object result = joinPoint.proceed();

            long duration = System.currentTimeMillis() - start;

            log.info(
                    "traceId={} requestId={} event=service_call stage=EXIT layer=service class={} method={} outcome=SUCCESS statusCode={} durationMs={} message=\"Success\"",
                    traceId, requestId, className, methodName, 200, duration);

            return result;

        } catch (Throwable ex) {

            long duration = System.currentTimeMillis() - start;

            log.error(
                    "traceId={} requestId={} event=service_call stage=EXIT layer=service class={} method={} outcome=FAILURE statusCode={} durationMs={} errorType={} message=\"{}\"",
                    traceId,
                    requestId,
                    className,
                    methodName,
                    500,
                    duration,
                    ex.getClass().getSimpleName(),
                    ex.getMessage());

            throw ex;
        }
    }

    /**
     * around aspect for logs of controller
     * 
     * @param joinPoint
     * @return
     * @throws Throwable
     */
    @Around("execution(* com.wsms.repository..*(..))")
    public Object aroundRepository(ProceedingJoinPoint joinPoint) throws Throwable {

        long start = System.currentTimeMillis();

        String className = joinPoint.getSignature().getDeclaringTypeName();
        String methodName = joinPoint.getSignature().getName();

        String traceId = resolveTraceId();
        String requestId = resolveRequestId();

        // TODO :- this is not production grid, later we will print this log into
        // internal call
        // for now we are just ignoring internally calls
        if (traceId == DEFAULT_TRACE_ID || requestId == DEFAULT_REQUEST_ID) {
            return joinPoint.proceed();
        }

        log.info(
                "traceId={} requestId={} event=repository_call stage=ENTRY layer=repository class={} method={} message=\"Started\"",
                traceId, requestId, className, methodName);

        try {
            Object result = joinPoint.proceed();

            long duration = System.currentTimeMillis() - start;

            log.info(
                    "traceId={} requestId={} event=repository_call stage=EXIT layer=repository class={} method={} outcome=SUCCESS statusCode={} durationMs={} message=\"Success\"",
                    traceId, requestId, className, methodName, 200, duration);

            return result;

        } catch (Throwable ex) {

            long duration = System.currentTimeMillis() - start;

            log.error(
                    "traceId={} requestId={} event=repository_call stage=EXIT layer=repository class={} method={} outcome=FAILURE statusCode={} durationMs={} errorType={} message=\"{}\"",
                    traceId,
                    requestId,
                    className,
                    methodName,
                    500,
                    duration,
                    ex.getClass().getSimpleName(),
                    ex.getMessage());

            throw ex;
        }
    }

    private String resolveTraceId() {
        String traceId = MDC.get("traceId");
        if (traceId == null || traceId.isBlank()) {
            return DEFAULT_TRACE_ID;
        }
        return traceId;
    }

    private String resolveRequestId() {
        String requestId = MDC.get("requestId");
        if (requestId == null || requestId.isBlank()) {
            return DEFAULT_REQUEST_ID;
        }
        return requestId;
    }
}
