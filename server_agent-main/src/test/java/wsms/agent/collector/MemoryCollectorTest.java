package wsms.agent.collector;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;

import static org.junit.jupiter.api.Assertions.*;

class MemoryCollectorTest {
    private MemoryCollector memoryCollector;

    @BeforeEach
    void setUp() {
        memoryCollector = new MemoryCollector();
    }

    @Test
    void testCollectReturnsValidMemoryPercentage() {
        double memoryUsage = memoryCollector.collect();
        assertTrue(memoryUsage >= 0, "Memory usage should not be negative");
        assertTrue(memoryUsage <= 100, "Memory usage should not exceed 100%");
    }

    @Test
    void testCollectReturnsNonNegativeValue() {
        double memoryUsage = memoryCollector.collect();
        assertTrue(memoryUsage >= 0, "Memory usage should be non-negative");
    }

    @Test
    void testMultipleCollectCalls() {
        double firstReading = memoryCollector.collect();
        double secondReading = memoryCollector.collect();
        
        assertTrue(firstReading >= 0 && firstReading <= 100);
        assertTrue(secondReading >= 0 && secondReading <= 100);
    }

    @Test
    void testCollectorInstantiation() {
        assertNotNull(memoryCollector, "MemoryCollector should be instantiated");
    }

    @Test
    void testConsecutiveCollections() {
        // Test that we can collect multiple times without errors
        for (int i = 0; i < 5; i++) {
            double usage = memoryCollector.collect();
            assertTrue(usage >= 0 && usage <= 100, 
                "Iteration " + i + ": Memory usage should be valid percentage");
        }
    }

    @Test
    void testMemoryUsageIsReasonable() {
        double memoryUsage = memoryCollector.collect();
        // On most systems, memory usage should be greater than 0
        // (unless total memory is reported as 0)
        assertTrue(memoryUsage >= 0, "Memory usage should be a valid number");
    }

    @Test
    void testCollectorWithNewInstance() {
        MemoryCollector newCollector = new MemoryCollector();
        double usage = newCollector.collect();
        assertTrue(usage >= 0 && usage <= 100);
    }

    @Test
    void testCollectDoesNotThrowException() {
        assertDoesNotThrow(() -> {
            memoryCollector.collect();
        }, "collect() should not throw any exceptions");
    }

    @Test
    void testMultipleInstancesIndependence() {
        MemoryCollector collector1 = new MemoryCollector();
        MemoryCollector collector2 = new MemoryCollector();
        
        double usage1 = collector1.collect();
        double usage2 = collector2.collect();
        
        // Both should return valid values
        assertTrue(usage1 >= 0 && usage1 <= 100);
        assertTrue(usage2 >= 0 && usage2 <= 100);
        
        // Values should be close (same system state)
        assertTrue(Math.abs(usage1 - usage2) < 5.0, 
            "Two collectors should report similar memory usage");
    }

    @Test
    void testCollectIsFastEnough() {
        long startTime = System.currentTimeMillis();
        memoryCollector.collect();
        long duration = System.currentTimeMillis() - startTime;
        
        // Collection should be very fast (under 100ms)
        assertTrue(duration < 100, "Memory collection should complete quickly");
    }
}
