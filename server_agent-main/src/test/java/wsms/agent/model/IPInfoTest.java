package wsms.agent.model;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class IPInfoTest {
    private IPInfo ipInfo;

    @BeforeEach
    void setUp() {
        ipInfo = new IPInfo();
    }

    @Test
    void testServerIdGetterAndSetter() {
        String serverId = "test-server-01";
        ipInfo.setServerId(serverId);
        assertEquals(serverId, ipInfo.getServerId());
    }

    @Test
    void testIpAddressesGetterAndSetter() {
        List<String> ips = Arrays.asList("192.168.1.10", "10.0.0.5");
        ipInfo.setIpAddresses(ips);
        assertEquals(ips, ipInfo.getIpAddresses());
        assertEquals(2, ipInfo.getIpAddresses().size());
    }

    @Test
    void testIpAddressesEmptyList() {
        List<String> emptyList = new ArrayList<>();
        ipInfo.setIpAddresses(emptyList);
        assertNotNull(ipInfo.getIpAddresses());
        assertTrue(ipInfo.getIpAddresses().isEmpty());
    }

    @Test
    void testIpAddressesNull() {
        ipInfo.setIpAddresses(null);
        assertNull(ipInfo.getIpAddresses());
    }

    @Test
    void testPrimaryIPGetterAndSetter() {
        String primaryIP = "192.168.1.100";
        ipInfo.setPrimaryIP(primaryIP);
        assertEquals(primaryIP, ipInfo.getPrimaryIP());
    }

    @Test
    void testPrimaryIPNull() {
        ipInfo.setPrimaryIP(null);
        assertNull(ipInfo.getPrimaryIP());
    }

    @Test
    void testPrimaryIPEmptyString() {
        ipInfo.setPrimaryIP("");
        assertEquals("", ipInfo.getPrimaryIP());
    }

    @Test
    void testTimestampGetterAndSetter() {
        Instant now = Instant.now();
        ipInfo.setTimestamp(now);
        assertEquals(now, ipInfo.getTimestamp());
    }

    @Test
    void testAllFieldsTogether() {
        String serverId = "server-456";
        List<String> ips = Arrays.asList("10.0.0.1", "172.16.0.1", "192.168.1.1");
        String primaryIP = "10.0.0.1";
        Instant timestamp = Instant.parse("2026-03-03T15:30:00Z");

        ipInfo.setServerId(serverId);
        ipInfo.setIpAddresses(ips);
        ipInfo.setPrimaryIP(primaryIP);
        ipInfo.setTimestamp(timestamp);

        assertEquals(serverId, ipInfo.getServerId());
        assertEquals(ips, ipInfo.getIpAddresses());
        assertEquals(primaryIP, ipInfo.getPrimaryIP());
        assertEquals(timestamp, ipInfo.getTimestamp());
    }

    @Test
    void testSingleIPAddress() {
        List<String> singleIP = Arrays.asList("192.168.0.1");
        ipInfo.setIpAddresses(singleIP);
        assertEquals(1, ipInfo.getIpAddresses().size());
        assertEquals("192.168.0.1", ipInfo.getIpAddresses().get(0));
    }

    @Test
    void testDefaultValues() {
        assertNull(ipInfo.getServerId());
        assertNull(ipInfo.getIpAddresses());
        assertNull(ipInfo.getPrimaryIP());
        assertNull(ipInfo.getTimestamp());
    }
}
