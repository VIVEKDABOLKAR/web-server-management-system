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

    //fileWriter for web
    private final PrintWriter fileWriterWeb;

    public Logger(String logFilePath) {
        try {

            //agent.log
            Path path = Path.of(logFilePath == null || logFilePath.isBlank() ? "agent.log" : logFilePath);
            this.fileWriter = new PrintWriter(Files.newBufferedWriter(path,
                    StandardOpenOption.CREATE,
                    StandardOpenOption.APPEND,
                    StandardOpenOption.WRITE), true);
        } catch (IOException ex) {
            throw new RuntimeException("Failed to open log file: " + ex.getMessage(), ex);
        }

        try {

            // agent_weeb.log for web request logs
            Path path_web = Path.of(logFilePath == null || logFilePath.isBlank() ? "agent_weeb.log" : "agent_weeb.log");
            this.fileWriterWeb = new PrintWriter(Files.newBufferedWriter(path_web,
                    StandardOpenOption.CREATE,
                    StandardOpenOption.APPEND,
                    StandardOpenOption.WRITE), true);
        } catch (IOException ex) {
            throw new RuntimeException("Failed to open log file: " + ex.getMessage(), ex);
        }
    }

    //INFO Log
    public synchronized void info(String msg) {
        write("[INFO]", msg, false, null);
    }

    //Error Log
    public synchronized void error(String msg) {
        write("[ERROR]", msg, false,null);
    }

    //INFO_WEB Log
    public synchronized void infoWeb(String msg) {
        write("[INFO_WEB]", msg, true,null);
    }

    //formated logging
    public synchronized void infof(String format, Object... args) {
        write("[INFO]", String.format(format, args), false,null);
    }

    public synchronized void errorf(String format, Object... args) {
        write("[ERROR]", String.format(format, args), false,null);
    }

    public synchronized void infoWebof(String format, Object... args) {
        write("[INFO_WEB]", String.format(format, args), true,null);
    }

    public synchronized void error(String msg, Throwable throwable) {
        write("[ERROR]", msg, false,throwable);
    }

    public synchronized void close() {
        fileWriter.flush();
        fileWriter.close();

        fileWriterWeb.flush();
        fileWriterWeb.close();
    }

    private void write(String level, String msg, boolean webFlag, Throwable throwable) {
        //formate of log
        String line = String.format("%s %s %s", level, LocalDateTime.now().format(FORMATTER), msg);

        //print in console
        System.out.println(line);

        //write in agent.log file
        if(!webFlag) {
            fileWriter.println(line);
        } else {
            fileWriterWeb.println(line);
        }
        //print and write error
        if (throwable != null) {
            throwable.printStackTrace(System.out);
            throwable.printStackTrace(fileWriter);
        }
    }
}
