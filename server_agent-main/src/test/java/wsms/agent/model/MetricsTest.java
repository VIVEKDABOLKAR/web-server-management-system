package wsms.agent.model;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import java.time.Instant;

import static org.junit.jupiter.api.Assertions.*;

class MetricsTest {
    private Metrics metrics;

    @BeforeEach
    void setUp() {
        metrics = new Metrics();
    }

    @Test
    void testServerIdGetterAndSetter() {
        String serverId = "test-server-01";
        metrics.setServerId(serverId);
        assertEquals(serverId, metrics.getServerId());
    }

    @Test
    void testServerIdNull() {
        metrics.setServerId(null);
        assertNull(metrics.getServerId());
    }

    @Test
    void testTimestampGetterAndSetter() {
        Instant now = Instant.now();
        metrics.setTimestamp(now);
        assertEquals(now, metrics.getTimestamp());
    }

    @Test
    void testCpuGetterAndSetter() {
        double cpuValue = 75.5;
        metrics.setCpu(cpuValue);
        assertEquals(cpuValue, metrics.getCpu(), 0.001);
    }

    @Test
    void testCpuZeroValue() {
        metrics.setCpu(0.0);
        assertEquals(0.0, metrics.getCpu(), 0.001);
    }

    @Test
    void testCpuMaxValue() {
        metrics.setCpu(100.0);
        assertEquals(100.0, metrics.getCpu(), 0.001);
    }

    @Test
    void testMemoryGetterAndSetter() {
        double memoryValue = 80.3;
        metrics.setMemory(memoryValue);
        assertEquals(memoryValue, metrics.getMemory(), 0.001);
    }

    @Test
    void testMemoryZeroValue() {
        metrics.setMemory(0.0);
        assertEquals(0.0, metrics.getMemory(), 0.001);
    }

    @Test
    void testDiskGetterAndSetter() {
        double diskValue = 65.7;
        metrics.setDisk(diskValue);
        assertEquals(diskValue, metrics.getDisk(), 0.001);
    }

    @Test
    void testDiskZeroValue() {
        metrics.setDisk(0.0);
        assertEquals(0.0, metrics.getDisk(), 0.001);
    }

    @Test
    void testAllFieldsTogether() {
        String serverId = "server-123";
        Instant timestamp = Instant.parse("2026-03-03T12:00:00Z");
        double cpu = 45.5;
        double memory = 60.2;
        double disk = 70.8;

        metrics.setServerId(serverId);
        metrics.setTimestamp(timestamp);
        metrics.setCpu(cpu);
        metrics.setMemory(memory);
        metrics.setDisk(disk);

        assertEquals(serverId, metrics.getServerId());
        assertEquals(timestamp, metrics.getTimestamp());
        assertEquals(cpu, metrics.getCpu(), 0.001);
        assertEquals(memory, metrics.getMemory(), 0.001);
        assertEquals(disk, metrics.getDisk(), 0.001);
    }

    @Test
    void testNegativeValues() {
        metrics.setCpu(-10.0);
        metrics.setMemory(-5.0);
        metrics.setDisk(-15.0);

        assertEquals(-10.0, metrics.getCpu(), 0.001);
        assertEquals(-5.0, metrics.getMemory(), 0.001);
        assertEquals(-15.0, metrics.getDisk(), 0.001);
    }

    @Test
    void testDefaultValues() {
        // Default primitive double should be 0.0
        assertEquals(0.0, metrics.getCpu(), 0.001);
        assertEquals(0.0, metrics.getMemory(), 0.001);
        assertEquals(0.0, metrics.getDisk(), 0.001);
        // Default object references should be null
        assertNull(metrics.getServerId());
        assertNull(metrics.getTimestamp());
    }
}
