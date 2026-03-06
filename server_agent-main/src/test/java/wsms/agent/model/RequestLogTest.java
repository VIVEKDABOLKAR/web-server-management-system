package wsms.agent.model;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import java.time.Instant;

import static org.junit.jupiter.api.Assertions.*;

class RequestLogTest {
    private RequestLog requestLog;

    @BeforeEach
    void setUp() {
        requestLog = new RequestLog();
    }

    @Test
    void testTimestampGetterAndSetter() {
        Instant timestamp = Instant.now();
        requestLog.setTimestamp(timestamp);
        assertEquals(timestamp, requestLog.getTimestamp());
    }

    @Test
    void testServerIdGetterAndSetter() {
        String serverId = "web-server-01";
        requestLog.setServerId(serverId);
        assertEquals(serverId, requestLog.getServerId());
    }

    @Test
    void testClientIPGetterAndSetter() {
        String clientIP = "203.0.113.42";
        requestLog.setClientIP(clientIP);
        assertEquals(clientIP, requestLog.getClientIP());
    }

    @Test
    void testMethodGetterAndSetter() {
        String method = "GET";
        requestLog.setMethod(method);
        assertEquals(method, requestLog.getMethod());
    }

    @Test
    void testMethodPost() {
        requestLog.setMethod("POST");
        assertEquals("POST", requestLog.getMethod());
    }

    @Test
    void testUrlGetterAndSetter() {
        String url = "/api/users/123";
        requestLog.setUrl(url);
        assertEquals(url, requestLog.getUrl());
    }

    @Test
    void testUrlRoot() {
        requestLog.setUrl("/");
        assertEquals("/", requestLog.getUrl());
    }

    @Test
    void testPortGetterAndSetter() {
        int port = 8080;
        requestLog.setPort(port);
        assertEquals(port, requestLog.getPort());
    }

    @Test
    void testPortStandardHTTP() {
        requestLog.setPort(80);
        assertEquals(80, requestLog.getPort());
    }

    @Test
    void testPortStandardHTTPS() {
        requestLog.setPort(443);
        assertEquals(443, requestLog.getPort());
    }

    @Test
    void testAllFieldsTogether() {
        Instant timestamp = Instant.parse("2026-03-03T10:15:30Z");
        String serverId = "server-789";
        String clientIP = "198.51.100.50";
        String method = "PUT";
        String url = "/api/data/update";
        int port = 3000;

        requestLog.setTimestamp(timestamp);
        requestLog.setServerId(serverId);
        requestLog.setClientIP(clientIP);
        requestLog.setMethod(method);
        requestLog.setUrl(url);
        requestLog.setPort(port);

        assertEquals(timestamp, requestLog.getTimestamp());
        assertEquals(serverId, requestLog.getServerId());
        assertEquals(clientIP, requestLog.getClientIP());
        assertEquals(method, requestLog.getMethod());
        assertEquals(url, requestLog.getUrl());
        assertEquals(port, requestLog.getPort());
    }

    @Test
    void testNullValues() {
        requestLog.setTimestamp(null);
        requestLog.setServerId(null);
        requestLog.setClientIP(null);
        requestLog.setMethod(null);
        requestLog.setUrl(null);

        assertNull(requestLog.getTimestamp());
        assertNull(requestLog.getServerId());
        assertNull(requestLog.getClientIP());
        assertNull(requestLog.getMethod());
        assertNull(requestLog.getUrl());
    }

    @Test
    void testEmptyStrings() {
        requestLog.setServerId("");
        requestLog.setClientIP("");
        requestLog.setMethod("");
        requestLog.setUrl("");

        assertEquals("", requestLog.getServerId());
        assertEquals("", requestLog.getClientIP());
        assertEquals("", requestLog.getMethod());
        assertEquals("", requestLog.getUrl());
    }

    @Test
    void testDefaultValues() {
        assertNull(requestLog.getTimestamp());
        assertNull(requestLog.getServerId());
        assertNull(requestLog.getClientIP());
        assertNull(requestLog.getMethod());
        assertNull(requestLog.getUrl());
        assertEquals(0, requestLog.getPort());
    }

    @Test
    void testVariousHTTPMethods() {
        String[] methods = {"GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"};
        for (String method : methods) {
            requestLog.setMethod(method);
            assertEquals(method, requestLog.getMethod());
        }
    }

    @Test
    void testComplexUrl() {
        String complexUrl = "/api/v2/users?id=123&filter=active&sort=desc";
        requestLog.setUrl(complexUrl);
        assertEquals(complexUrl, requestLog.getUrl());
    }
}
