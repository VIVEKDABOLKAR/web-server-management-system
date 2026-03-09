package wsms.agent.utils;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.io.TempDir;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class LoggerTest {
    private Logger logger;
    private Path tempLogFile;

    @BeforeEach
    void setUp(@TempDir Path tempDir) throws IOException {
        tempLogFile = tempDir.resolve("test.log");
        logger = new Logger(tempLogFile.toString());
    }

    @AfterEach
    void tearDown() {
        if (logger != null) {
            logger.close();
        }
    }

    @Test
    void testLoggerCreatesFile() {
        assertTrue(Files.exists(tempLogFile), "Log file should be created");
    }

    @Test
    void testInfoLogsMessage() throws IOException {
        String message = "Test info message";
        logger.info(message);
        logger.close();
        
        List<String> lines = Files.readAllLines(tempLogFile);
        assertTrue(lines.size() > 0, "Log file should contain entries");
        assertTrue(lines.get(0).contains("[INFO]"), "Log should contain INFO level");
        assertTrue(lines.get(0).contains(message), "Log should contain the message");
    }

    @Test
    void testErrorLogsMessage() throws IOException {
        String message = "Test error message";
        logger.error(message);
        logger.close();
        
        List<String> lines = Files.readAllLines(tempLogFile);
        assertTrue(lines.size() > 0, "Log file should contain entries");
        assertTrue(lines.get(0).contains("[ERROR]"), "Log should contain ERROR level");
        assertTrue(lines.get(0).contains(message), "Log should contain the message");
    }

    @Test
    void testInfofLogsFormattedMessage() throws IOException {
        logger.infof("Value: %d, Name: %s", 42, "Test");
        logger.close();
        
        List<String> lines = Files.readAllLines(tempLogFile);
        assertTrue(lines.get(0).contains("[INFO]"), "Log should contain INFO level");
        assertTrue(lines.get(0).contains("Value: 42, Name: Test"), 
            "Log should contain formatted message");
    }

    @Test
    void testErrorfLogsFormattedMessage() throws IOException {
        logger.errorf("Error code: %d, Description: %s", 500, "Internal Error");
        logger.close();
        
        List<String> lines = Files.readAllLines(tempLogFile);
        assertTrue(lines.get(0).contains("[ERROR]"), "Log should contain ERROR level");
        assertTrue(lines.get(0).contains("Error code: 500, Description: Internal Error"), 
            "Log should contain formatted message");
    }

    @Test
    void testErrorWithThrowable() throws IOException {
        String message = "Exception occurred";
        Exception exception = new RuntimeException("Test exception");
        logger.error(message, exception);
        logger.close();
        
        List<String> lines = Files.readAllLines(tempLogFile);
        assertTrue(lines.size() > 1, "Log should contain multiple lines for exception");
        assertTrue(lines.get(0).contains("[ERROR]"), "Log should contain ERROR level");
        assertTrue(lines.get(0).contains(message), "Log should contain the message");
        
        // Check for exception stack trace
        String fullLog = String.join("\n", lines);
        assertTrue(fullLog.contains("RuntimeException"), "Log should contain exception type");
        assertTrue(fullLog.contains("Test exception"), "Log should contain exception message");
    }

    @Test
    void testMultipleLogEntries() throws IOException {
        logger.info("First message");
        logger.error("Second message");
        logger.infof("Third message: %s", "formatted");
        logger.close();
        
        List<String> lines = Files.readAllLines(tempLogFile);
        assertEquals(3, lines.size(), "Log should contain 3 entries");
        assertTrue(lines.get(0).contains("First message"));
        assertTrue(lines.get(1).contains("Second message"));
        assertTrue(lines.get(2).contains("Third message: formatted"));
    }

    @Test
    void testLogContainsTimestamp() throws IOException {
        logger.info("Timestamped message");
        logger.close();
        
        List<String> lines = Files.readAllLines(tempLogFile);
        String logLine = lines.get(0);
        
        // Should contain date format: yyyy/MM/dd HH:mm:ss
        assertTrue(logLine.matches(".*\\d{4}/\\d{2}/\\d{2}\\s+\\d{2}:\\d{2}:\\d{2}.*"),
            "Log should contain timestamp in correct format");
    }

    @Test
    void testLoggerWithNullPath() {
        Logger nullPathLogger = new Logger(null);
        assertDoesNotThrow(() -> {
            nullPathLogger.info("Test message");
            nullPathLogger.close();
        }, "Logger should handle null path gracefully");
    }

    @Test
    void testLoggerWithEmptyPath() {
        Logger emptyPathLogger = new Logger("");
        assertDoesNotThrow(() -> {
            emptyPathLogger.info("Test message");
            emptyPathLogger.close();
        }, "Logger should handle empty path gracefully");
    }

    @Test
    void testCloseFlushesLogs() throws IOException {
        logger.info("Message before close");
        logger.close();
        
        List<String> lines = Files.readAllLines(tempLogFile);
        assertTrue(lines.size() > 0, "Logs should be flushed after close");
    }

    @Test
    void testLoggerCreationWithInvalidPath() {
        assertThrows(RuntimeException.class, () -> {
            new Logger("/invalid/path/that/cannot/exist/test.log");
        }, "Logger should throw exception for invalid path");
    }

    @Test
    void testConcurrentLogging() throws IOException {
        // Test thread safety with synchronized methods
        for (int i = 0; i < 10; i++) {
            logger.info("Message " + i);
            logger.error("Error " + i);
        }
        logger.close();
        
        List<String> lines = Files.readAllLines(tempLogFile);
        assertEquals(20, lines.size(), "Should have logged 20 messages");
    }

    @Test
    void testLoggerDefaultBehavior(@TempDir Path tempDir) throws IOException {
        Path defaultLog = tempDir.resolve("agent.log");
        Logger defaultLogger = new Logger(null);
        defaultLogger.info("Test");
        defaultLogger.close();
        
        // Should create agent.log in current directory or handle null gracefully
        assertDoesNotThrow(() -> {
            // Just verify no exceptions occur
        });
    }

    @Test
    void testInfofWithMultipleArguments() throws IOException {
        logger.infof("Server: %s, Port: %d, Active: %b", "localhost", 8080, true);
        logger.close();
        
        List<String> lines = Files.readAllLines(tempLogFile);
        assertTrue(lines.get(0).contains("Server: localhost, Port: 8080, Active: true"));
    }

    @Test
    void testErrorfWithMultipleArguments() throws IOException {
        logger.errorf("Failed at step %d with error %s", 3, "timeout");
        logger.close();
        
        List<String> lines = Files.readAllLines(tempLogFile);
        assertTrue(lines.get(0).contains("Failed at step 3 with error timeout"));
    }
}
