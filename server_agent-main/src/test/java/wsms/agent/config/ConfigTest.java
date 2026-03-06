package wsms.agent.config;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class ConfigTest {

    @Test
    void testLoadReturnsDefaultConfig() {
        Config config = Config.load("non-existent-config.json");
        assertNotNull(config, "Config should not be null");
    }

    @Test
    void testDefaultConfigHasServerId() {
        Config config = Config.load("any-path.json");
        assertNotNull(config.getServerId(), "Server ID should not be null");
        assertEquals("kali-vm-01", config.getServerId(), 
            "Default server ID should be kali-vm-01");
    }

    @Test
    void testDefaultConfigHasCollectionInterval() {
        Config config = Config.load("any-path.json");
        assertNotNull(config.getCollectionInterval(), 
            "Collection interval should not be null");
        assertEquals(Duration.ofSeconds(5), config.getCollectionInterval(),
            "Default collection interval should be 5 seconds");
    }

    @Test
    void testDefaultConfigHasLogFile() {
        Config config = Config.load("any-path.json");
        assertNotNull(config.getLogFile(), "Log file should not be null");
        assertEquals("agent.log", config.getLogFile(),
            "Default log file should be agent.log");
    }

    @Test
    void testSaveCreatesJsonFile(@TempDir Path tempDir) throws IOException {
        Config config = Config.load("test");
        Path configFile = tempDir.resolve("config.json");
        
        config.save(configFile.toString());
        
        assertTrue(Files.exists(configFile), "Config file should be created");
    }

    @Test
    void testSaveWritesValidJson(@TempDir Path tempDir) throws IOException {
        Config config = Config.load("test");
        Path configFile = tempDir.resolve("config.json");
        
        config.save(configFile.toString());
        
        List<String> lines = Files.readAllLines(configFile);
        String content = String.join("\n", lines);
        
        assertTrue(content.contains("server_id"), "JSON should contain server_id");
        assertTrue(content.contains("collection_interval"), 
            "JSON should contain collection_interval");
        assertTrue(content.contains("log_file"), "JSON should contain log_file");
        assertTrue(content.contains("{"), "JSON should start with {");
        assertTrue(content.contains("}"), "JSON should end with }");
    }

    @Test
    void testSaveIncludesServerId(@TempDir Path tempDir) throws IOException {
        Config config = Config.load("test");
        Path configFile = tempDir.resolve("config.json");
        
        config.save(configFile.toString());
        
        String content = Files.readString(configFile);
        assertTrue(content.contains("\"server_id\": \"kali-vm-01\""),
            "Saved config should contain server ID");
    }

    @Test
    void testSaveIncludesCollectionInterval(@TempDir Path tempDir) throws IOException {
        Config config = Config.load("test");
        Path configFile = tempDir.resolve("config.json");
        
        config.save(configFile.toString());
        
        String content = Files.readString(configFile);
        assertTrue(content.contains("\"collection_interval\": 5"),
            "Saved config should contain collection interval");
    }

    @Test
    void testSaveIncludesLogFile(@TempDir Path tempDir) throws IOException {
        Config config = Config.load("test");
        Path configFile = tempDir.resolve("config.json");
        
        config.save(configFile.toString());
        
        String content = Files.readString(configFile);
        assertTrue(content.contains("\"log_file\": \"agent.log\""),
            "Saved config should contain log file");
    }

    @Test
    void testSaveIncludesThresholds(@TempDir Path tempDir) throws IOException {
        Config config = Config.load("test");
        Path configFile = tempDir.resolve("config.json");
        
        config.save(configFile.toString());
        
        String content = Files.readString(configFile);
        assertTrue(content.contains("\"cpu_threshold\": 80.0"),
            "Should contain CPU threshold");
        assertTrue(content.contains("\"memory_threshold\": 85.0"),
            "Should contain memory threshold");
        assertTrue(content.contains("\"disk_threshold\": 90.0"),
            "Should contain disk threshold");
    }

    @Test
    void testSaveIncludesFlags(@TempDir Path tempDir) throws IOException {
        Config config = Config.load("test");
        Path configFile = tempDir.resolve("config.json");
        
        config.save(configFile.toString());
        
        String content = Files.readString(configFile);
        assertTrue(content.contains("\"enable_cpu\": true"),
            "Should contain enable_cpu flag");
        assertTrue(content.contains("\"enable_memory\": true"),
            "Should contain enable_memory flag");
    }

    @Test
    void testLoadWithNullPath() {
        Config config = Config.load(null);
        assertNotNull(config, "Config should not be null even with null path");
        // Should return defaults
        assertEquals("kali-vm-01", config.getServerId());
    }

    @Test
    void testLoadWithEmptyPath() {
        Config config = Config.load("");
        assertNotNull(config, "Config should not be null even with empty path");
    }

    @Test
    void testDefaultConfigValues() {
        Config config = Config.load("test");
        
        assertEquals("kali-vm-01", config.getServerId());
        assertEquals(Duration.ofSeconds(5), config.getCollectionInterval());
        assertEquals("agent.log", config.getLogFile());
    }

    @Test
    void testMultipleLoadCallsReturnNewInstances() {
        Config config1 = Config.load("path1");
        Config config2 = Config.load("path2");
        
        assertNotSame(config1, config2, 
            "Each load call should return a new instance");
    }

    @Test
    void testConfigGettersReturnNonNull() {
        Config config = Config.load("test");
        
        assertNotNull(config.getServerId());
        assertNotNull(config.getCollectionInterval());
        assertNotNull(config.getLogFile());
    }

    @Test
    void testCollectionIntervalIsPositive() {
        Config config = Config.load("test");
        assertTrue(config.getCollectionInterval().getSeconds() > 0,
            "Collection interval should be positive");
    }

    @Test
    void testSaveHandlesSpecialCharacters(@TempDir Path tempDir) throws IOException {
        Config config = Config.load("test");
        Path configFile = tempDir.resolve("config-special.json");
        
        // Should handle saving without errors
        assertDoesNotThrow(() -> config.save(configFile.toString()));
        
        assertTrue(Files.exists(configFile));
    }

    @Test
    void testSaveCreatesValidJsonStructure(@TempDir Path tempDir) throws IOException {
        Config config = Config.load("test");
        Path configFile = tempDir.resolve("config.json");
        
        config.save(configFile.toString());
        
        String content = Files.readString(configFile);
        
        // Count braces to ensure valid structure
        long openBraces = content.chars().filter(ch -> ch == '{').count();
        long closeBraces = content.chars().filter(ch -> ch == '}').count();
        
        assertEquals(openBraces, closeBraces, 
            "JSON should have balanced braces");
    }

    @Test
    void testSaveToInvalidPathThrowsException() {
        Config config = Config.load("test");
        
        assertThrows(IOException.class, () -> {
            config.save("/invalid/path/that/does/not/exist/config.json");
        }, "Save to invalid path should throw IOException");
    }
}
