package wsms.agent.network;

import org.junit.jupiter.api.Test;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class IPUtilsTest {

    @Test
    void testGetLocalIPsReturnsNonNullList() throws Exception {
        List<String> ips = IPUtils.getLocalIPs();
        assertNotNull(ips, "getLocalIPs should never return null");
    }

    @Test
    void testGetLocalIPsReturnsValidIPFormat() throws Exception {
        List<String> ips = IPUtils.getLocalIPs();
        for (String ip : ips) {
            assertNotNull(ip, "IP address should not be null");
            assertFalse(ip.isEmpty(), "IP address should not be empty");
            // Basic format check: should contain dots and digits
            assertTrue(ip.matches("\\d+\\.\\d+\\.\\d+\\.\\d+"), 
                "IP address should be in IPv4 format: " + ip);
        }
    }

    @Test
    void testGetLocalIPsExcludesLoopback() throws Exception {
        List<String> ips = IPUtils.getLocalIPs();
        for (String ip : ips) {
            assertFalse(ip.equals("127.0.0.1"), 
                "Loopback address should be excluded");
            assertFalse(ip.startsWith("127."), 
                "Loopback addresses should be excluded");
        }
    }

    @Test
    void testGetPrimaryIPReturnsStringOrEmpty() throws Exception {
        String primaryIP = IPUtils.getPrimaryIP();
        assertNotNull(primaryIP, "getPrimaryIP should never return null");
    }

    @Test
    void testGetPrimaryIPReturnsValidFormat() throws Exception {
        String primaryIP = IPUtils.getPrimaryIP();
        if (!primaryIP.isEmpty()) {
            assertTrue(primaryIP.matches("\\d+\\.\\d+\\.\\d+\\.\\d+"), 
                "Primary IP should be in IPv4 format: " + primaryIP);
        }
    }

    @Test
    void testGetPrimaryIPIsFirstOfLocalIPs() throws Exception {
        List<String> ips = IPUtils.getLocalIPs();
        String primaryIP = IPUtils.getPrimaryIP();
        
        if (!ips.isEmpty()) {
            assertEquals(ips.get(0), primaryIP, 
                "Primary IP should be the first local IP");
        } else {
            assertEquals("", primaryIP, 
                "Primary IP should be empty when no local IPs available");
        }
    }

    @Test
    void testGetAllPrimaryIPsReturnsNonNullList() throws Exception {
        List<String> allPrimaryIPs = IPUtils.getAllPrimaryIPs();
        assertNotNull(allPrimaryIPs, "getAllPrimaryIPs should never return null");
    }

    @Test
    void testGetAllPrimaryIPsEqualsGetLocalIPs() throws Exception {
        List<String> localIPs = IPUtils.getLocalIPs();
        List<String> allPrimaryIPs = IPUtils.getAllPrimaryIPs();
        
        assertEquals(localIPs.size(), allPrimaryIPs.size(), 
            "getAllPrimaryIPs should return same count as getLocalIPs");
        assertEquals(localIPs, allPrimaryIPs, 
            "getAllPrimaryIPs should return same list as getLocalIPs");
    }

    @Test
    void testGetLocalIPsConsistencyAcrossMultipleCalls() throws Exception {
        List<String> ips1 = IPUtils.getLocalIPs();
        List<String> ips2 = IPUtils.getLocalIPs();
        
        // Should return same IPs (unless network changed)
        assertEquals(ips1.size(), ips2.size(), 
            "getLocalIPs should return consistent results");
    }

    @Test
    void testGetPrimaryIPConsistency() throws Exception {
        String ip1 = IPUtils.getPrimaryIP();
        String ip2 = IPUtils.getPrimaryIP();
        
        assertEquals(ip1, ip2, "getPrimaryIP should return consistent results");
    }

    @Test
    void testIPAddressesAreNotLoopback() throws Exception {
        List<String> ips = IPUtils.getLocalIPs();
        for (String ip : ips) {
            assertNotEquals("127.0.0.1", ip, "Should not include IPv4 loopback");
            assertNotEquals("::1", ip, "Should not include IPv6 loopback");
        }
    }

    @Test
    void testIPAddressRanges() throws Exception {
        List<String> ips = IPUtils.getLocalIPs();
        for (String ip : ips) {
            String[] parts = ip.split("\\.");
            assertEquals(4, parts.length, "IPv4 address should have 4 octets");
            
            for (String part : parts) {
                int octet = Integer.parseInt(part);
                assertTrue(octet >= 0 && octet <= 255, 
                    "Each octet should be between 0 and 255: " + octet);
            }
        }
    }

    @Test
    void testGetLocalIPsDoesNotThrowException() {
        assertDoesNotThrow(() -> {
            IPUtils.getLocalIPs();
        }, "getLocalIPs should not throw exceptions");
    }

    @Test
    void testGetPrimaryIPDoesNotThrowException() {
        assertDoesNotThrow(() -> {
            IPUtils.getPrimaryIP();
        }, "getPrimaryIP should not throw exceptions");
    }

    @Test
    void testGetAllPrimaryIPsDoesNotThrowException() {
        assertDoesNotThrow(() -> {
            IPUtils.getAllPrimaryIPs();
        }, "getAllPrimaryIPs should not throw exceptions");
    }
}
