package wsms.agent.utils;

import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class Logger {
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss");
    private final PrintWriter fileWriter;

    public Logger(String logFilePath) {
        try {
            Path path = Path.of(logFilePath == null || logFilePath.isBlank() ? "agent.log" : logFilePath);
            this.fileWriter = new PrintWriter(Files.newBufferedWriter(path,
                    StandardOpenOption.CREATE,
                    StandardOpenOption.APPEND,
                    StandardOpenOption.WRITE), true);
        } catch (IOException ex) {
            throw new RuntimeException("Failed to open log file: " + ex.getMessage(), ex);
        }
    }

    public synchronized void info(String msg) {
        write("[INFO]", msg, null);
    }

    public synchronized void error(String msg) {
        write("[ERROR]", msg, null);
    }

    public synchronized void infof(String format, Object... args) {
        write("[INFO]", String.format(format, args), null);
    }

    public synchronized void errorf(String format, Object... args) {
        write("[ERROR]", String.format(format, args), null);
    }

    public synchronized void error(String msg, Throwable throwable) {
        write("[ERROR]", msg, throwable);
    }

    public synchronized void close() {
        fileWriter.flush();
        fileWriter.close();
    }

    private void write(String level, String msg, Throwable throwable) {
        String line = String.format("%s %s %s", level, LocalDateTime.now().format(FORMATTER), msg);
        System.out.println(line);
        fileWriter.println(line);
        if (throwable != null) {
            throwable.printStackTrace(System.out);
            throwable.printStackTrace(fileWriter);
        }
    }
}
