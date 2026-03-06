package wsms.agent.collector;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;

import static org.junit.jupiter.api.Assertions.*;

class CPUCollectorTest {
    private CPUCollector cpuCollector;

    @BeforeEach
    void setUp() {
        cpuCollector = new CPUCollector();
    }

    @Test
    void testCollectReturnsSomeCPUValue() throws InterruptedException {
        double cpuUsage = cpuCollector.collect();
        // CPU usage should be between 0 and 100, or 0 if unavailable
        assertTrue(cpuUsage >= 0, "CPU usage should not be negative");
        assertTrue(cpuUsage <= 100, "CPU usage should not exceed 100%");
    }

    @Test
    void testCollectReturnsNonNegativeValue() throws InterruptedException {
        double cpuUsage = cpuCollector.collect();
        assertTrue(cpuUsage >= 0, "CPU usage should be non-negative");
    }

    @Test
    void testMultipleCollectCalls() throws InterruptedException {
        double firstReading = cpuCollector.collect();
        double secondReading = cpuCollector.collect();
        
        assertTrue(firstReading >= 0);
        assertTrue(secondReading >= 0);
        // Both readings should be valid percentages
        assertTrue(firstReading <= 100);
        assertTrue(secondReading <= 100);
    }

    @Test
    void testCollectorInstantiation() {
        assertNotNull(cpuCollector, "CPUCollector should be instantiated");
    }

    @Test
    void testCollectWaitsForMeasurement() throws InterruptedException {
        long startTime = System.currentTimeMillis();
        cpuCollector.collect();
        long endTime = System.currentTimeMillis();
        
        long duration = endTime - startTime;
        // collect() should take at least 1000ms (Thread.sleep(1000))
        assertTrue(duration >= 1000, "collect() should wait at least 1 second");
    }

    @Test
    void testConsecutiveCollections() throws InterruptedException {
        // Test that we can collect multiple times without errors
        for (int i = 0; i < 3; i++) {
            double usage = cpuCollector.collect();
            assertTrue(usage >= 0 && usage <= 100, 
                "Iteration " + i + ": CPU usage should be valid percentage");
        }
    }

    @Test
    void testCollectorWithNewInstance() throws InterruptedException {
        CPUCollector newCollector = new CPUCollector();
        double usage = newCollector.collect();
        assertTrue(usage >= 0 && usage <= 100);
    }
}
