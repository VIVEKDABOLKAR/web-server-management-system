package wsms.agent.collector;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;

import static org.junit.jupiter.api.Assertions.*;

class DiskCollectorTest {
    private DiskCollector diskCollector;

    @BeforeEach
    void setUp() {
        diskCollector = new DiskCollector("/");
    }

    @Test
    void testCollectReturnsValidDiskPercentage() {
        double diskUsage = diskCollector.collect();
        assertTrue(diskUsage >= 0, "Disk usage should not be negative");
        assertTrue(diskUsage <= 100, "Disk usage should not exceed 100%");
    }

    @Test
    void testCollectWithRootPath() {
        DiskCollector rootCollector = new DiskCollector("/");
        double usage = rootCollector.collect();
        assertTrue(usage >= 0 && usage <= 100);
    }

    @Test
    void testCollectWithCurrentDirectory() {
        DiskCollector currentDirCollector = new DiskCollector(".");
        double usage = currentDirCollector.collect();
        assertTrue(usage >= 0 && usage <= 100);
    }

    @Test
    void testCollectWithInvalidPath() {
        DiskCollector invalidCollector = new DiskCollector("/nonexistent/path/that/does/not/exist");
        double usage = invalidCollector.collect();
        // Should fallback to roots and return valid percentage or 0
        assertTrue(usage >= 0 && usage <= 100);
    }

    @Test
    void testMultipleCollectCalls() {
        double firstReading = diskCollector.collect();
        double secondReading = diskCollector.collect();
        
        assertTrue(firstReading >= 0 && firstReading <= 100);
        assertTrue(secondReading >= 0 && secondReading <= 100);
        
        // Disk usage should be relatively stable between quick reads
        assertTrue(Math.abs(firstReading - secondReading) < 5.0,
            "Disk usage should be stable between consecutive reads");
    }

    @Test
    void testCollectorInstantiation() {
        assertNotNull(diskCollector, "DiskCollector should be instantiated");
    }

    @Test
    void testConsecutiveCollections() {
        for (int i = 0; i < 5; i++) {
            double usage = diskCollector.collect();
            assertTrue(usage >= 0 && usage <= 100, 
                "Iteration " + i + ": Disk usage should be valid percentage");
        }
    }

    @Test
    void testCollectDoesNotThrowException() {
        assertDoesNotThrow(() -> {
            diskCollector.collect();
        }, "collect() should not throw any exceptions");
    }

    @Test
    void testDifferentPathsReturnValidValues() {
        String[] paths = {"/", ".", System.getProperty("user.home")};
        
        for (String path : paths) {
            DiskCollector collector = new DiskCollector(path);
            double usage = collector.collect();
            assertTrue(usage >= 0 && usage <= 100,
                "Path '" + path + "' should return valid disk usage");
        }
    }

    @Test
    void testCollectHandlesNullPath() {
        DiskCollector nullPathCollector = new DiskCollector(null);
        // Should handle null gracefully
        assertDoesNotThrow(() -> {
            double usage = nullPathCollector.collect();
            assertTrue(usage >= 0 && usage <= 100);
        });
    }

    @Test
    void testCollectHandlesEmptyPath() {
        DiskCollector emptyPathCollector = new DiskCollector("");
        double usage = emptyPathCollector.collect();
        // Should fallback to roots
        assertTrue(usage >= 0 && usage <= 100);
    }

    @Test
    void testCollectIsFastEnough() {
        long startTime = System.currentTimeMillis();
        diskCollector.collect();
        long duration = System.currentTimeMillis() - startTime;
        
        // Collection should be fast (under 1 second)
        assertTrue(duration < 1000, "Disk collection should complete quickly");
    }

    @Test
    void testMultipleInstancesWithSamePath() {
        DiskCollector collector1 = new DiskCollector("/");
        DiskCollector collector2 = new DiskCollector("/");
        
        double usage1 = collector1.collect();
        double usage2 = collector2.collect();
        
        assertTrue(usage1 >= 0 && usage1 <= 100);
        assertTrue(usage2 >= 0 && usage2 <= 100);
        
        // Should report same or very similar usage
        assertTrue(Math.abs(usage1 - usage2) < 1.0,
            "Two collectors on same path should report similar usage");
    }

    @Test
    void testDiskUsageIsReasonable() {
        double diskUsage = diskCollector.collect();
        // Disk usage should be a valid number
        assertFalse(Double.isNaN(diskUsage), "Disk usage should not be NaN");
        assertFalse(Double.isInfinite(diskUsage), "Disk usage should not be infinite");
    }
}
