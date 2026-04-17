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

            String className = joinPoint.getSignature().getDeclaringType().getSimpleName();
            String methodName = joinPoint.getSignature().getName();

            log.info(
                    "traceId={} requestId={} event={} stage={} layer={} class={} method={} message=\"Started\"",
                    traceId,
                    requestId,
                    pad("controller_call", 16),
                    pad("ENTRY", 7),
                    pad("controller", 14),
                    pad(className, 20),
                    pad(methodName, 14)
            );

            try {
                Object result = joinPoint.proceed();

                long duration = System.currentTimeMillis() - start;

                log.info(
                        "traceId={} requestId={} event={} stage={} layer={} class={} method={} outcome={} statusCode={} durationMs={} message=\"Success\"",
                        traceId,
                        requestId,
                        pad("controller_call", 16),
                        pad("EXIT", 7),
                        pad("controller", 14),
                        pad(className, 20),
                        pad(methodName, 14),
                        pad("SUCCESS", 9),
                        pad("200", 4),
                        pad(duration, 3)
                );

                return result;

            } catch (Throwable ex) {

                long duration = System.currentTimeMillis() - start;

                log.error(
                        "traceId={} requestId={} event={} stage={} layer={} class={} method={} outcome={} statusCode={} durationMs={} errorType={} message=\"{}\"",
                        traceId,
                        requestId,
                        pad("controller_call", 16),
                        pad("EXIT", 7),
                        pad("controller", 14),
                        pad(className, 20),
                        pad(methodName, 14),
                        pad("FAILURE", 9),
                        pad("500", 4),
                        pad(duration, 3),
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

            String className = joinPoint.getSignature().getDeclaringType().getSimpleName();
            String methodName = joinPoint.getSignature().getName();

            String traceId = resolveTraceId();
            String requestId = resolveRequestId();

            if (DEFAULT_TRACE_ID.equals(traceId) || DEFAULT_REQUEST_ID.equals(requestId)) {
                return joinPoint.proceed();
            }

            log.info(
                    "traceId={} requestId={} event={} stage={} layer={} class={} method={} message=\"Started\"",
                    traceId,
                    requestId,
                    pad("service_call", 16),
                    pad("ENTRY", 7),
                    pad("service", 14),
                    pad(className, 20),
                    pad(methodName, 14)
            );

            try {
                Object result = joinPoint.proceed();

                long duration = System.currentTimeMillis() - start;

                log.info(
                        "traceId={} requestId={} event={} stage={} layer={} class={} method={} outcome={} statusCode={} durationMs={} message=\"Success\"",
                        traceId,
                        requestId,
                        pad("service_call", 16),
                        pad("EXIT", 7),
                        pad("service", 14),
                        pad(className, 20),
                        pad(methodName, 14),
                        pad("SUCCESS", 9),
                        pad("200", 4),
                        pad(duration, 3)
                );

                return result;

            } catch (Throwable ex) {

                long duration = System.currentTimeMillis() - start;

                log.error(
                        "traceId={} requestId={} event={} stage={} layer={} class={} method={} outcome={} statusCode={} durationMs={} errorType={} message=\"{}\"",
                        traceId,
                        requestId,
                        pad("service_call", 16),
                        pad("EXIT", 7),
                        pad("service", 14),
                        pad(className, 20),
                        pad(methodName, 14),
                        pad("FAILURE", 9),
                        pad("500", 4),
                        pad(duration, 3),
                        ex.getClass().getSimpleName(),
                        ex.getMessage()
                );

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

            String className = joinPoint.getSignature().getDeclaringType().getSimpleName();
            String methodName = joinPoint.getSignature().getName();

            String traceId = resolveTraceId();
            String requestId = resolveRequestId();

            if (DEFAULT_TRACE_ID.equals(traceId) || DEFAULT_REQUEST_ID.equals(requestId)) {
                return joinPoint.proceed();
            }

            log.info(
                    "traceId={} requestId={} event={} stage={} layer={} class={} method={} message=\"Started\"",
                    traceId,
                    requestId,
                    pad("repository_call", 16),
                    pad("ENTRY", 7),
                    pad("repository", 14),
                    pad(className, 20),
                    pad(methodName, 14)
            );

            try {
                Object result = joinPoint.proceed();

                long duration = System.currentTimeMillis() - start;

                log.info(
                        "traceId={} requestId={} event={} stage={} layer={} class={} method={} outcome={} statusCode={} durationMs={} message=\"Success\"",
                        traceId,
                        requestId,
                        pad("repository_call", 16),
                        pad("EXIT", 7),
                        pad("repository", 14),
                        pad(className, 20),
                        pad(methodName, 14),
                        pad("SUCCESS", 9),
                        pad("200", 4),
                        pad(duration, 3)
                );

                return result;

            } catch (Throwable ex) {

                long duration = System.currentTimeMillis() - start;

                log.error(
                        "traceId={} requestId={} event={} stage={} layer={} class={} method={} outcome={} statusCode={} durationMs={} errorType={} message=\"{}\"",
                        traceId,
                        requestId,
                        pad("repository_call", 16),
                        pad("EXIT", 7),
                        pad("repository", 14),
                        pad(className, 20),
                        pad(methodName, 14),
                        pad("FAILURE", 9),
                        pad("500", 4),
                        pad(duration, 3),
                        ex.getClass().getSimpleName(),
                        ex.getMessage()
                );

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

        private String pad(Object value, int paddding) {
            String strValue = String.valueOf(value);
            if (strValue.length() > paddding) {
                return strValue.substring(0, paddding);
            }
            return String.format("%-"+paddding+"s", value); // left align
        }

        private String pad(String value) {
            return pad(value, 16); // left align, 16 chars
        }
    }
