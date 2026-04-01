package com.wsms.terminal;

import com.pty4j.PtyProcess;
import com.pty4j.PtyProcessBuilder;
import com.pty4j.WinSize;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Pattern;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.ConcurrentWebSocketSessionDecorator;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Component
@RequiredArgsConstructor
public class TerminalWebSocketHandler extends TextWebSocketHandler {

    private final Map<String, TerminalSessionState> sessions = new ConcurrentHashMap<>();

    @Value("${app.terminal.shell}")
    private String configuredShell;

    private static final Set<String> ALLOWED_COMMANDS = Set.of(
        "ssh", "curl", "wget", "chmod", "ls", "pwd", "cat", "echo",
        "sed", "dos2unix", "bash", "sh", "exit", "sudo", "apt", "apt-get",
        "yum", "dnf", "systemctl", "service", "java", "which", "uname",
        "hostname", "whoami", "ping", "mkdir", "cd", "cp", "mv",
        "tar", "unzip", "zip", "nano", "vim", "vi", "less", "more",
        "grep", "awk", "ps", "top", "df", "du", "free", "id",
        "env", "export", "source", "./install-script.sh", "install-script.sh"
    );

    private static final Pattern[] BLOCKED_PATTERNS = {
        Pattern.compile("^\\s*rm\\s+(-[a-z]*f[a-z]*r[a-z]*|-[a-z]*r[a-z]*f[a-z]*)\\s+/", Pattern.CASE_INSENSITIVE),
        Pattern.compile("^\\s*rm\\s+.*--recursive\\s+/", Pattern.CASE_INSENSITIVE),
        Pattern.compile("^\\s*:\\s*\\(\\s*\\)\\s*\\{"),        // fork bomb
        Pattern.compile("^\\s*mkfs", Pattern.CASE_INSENSITIVE),
        Pattern.compile("^\\s*dd\\s+.*of=/dev/", Pattern.CASE_INSENSITIVE),
        Pattern.compile("^\\s*>\\s*/dev/(sda|hda|vda|nvme)", Pattern.CASE_INSENSITIVE),
        Pattern.compile("^\\s*fdisk\\s", Pattern.CASE_INSENSITIVE),
        Pattern.compile("^\\s*parted\\s", Pattern.CASE_INSENSITIVE),
        Pattern.compile("^\\s*shred\\s", Pattern.CASE_INSENSITIVE),
        Pattern.compile("^\\s*wipefs\\s", Pattern.CASE_INSENSITIVE),
    };

    private boolean isCommandAllowed(String rawInput) {
        if (rawInput == null || rawInput.isBlank()) return true;
        String trimmed = rawInput.trim();
        for (Pattern blocked : BLOCKED_PATTERNS) {
            if (blocked.matcher(trimmed).find()) return false;
        }
        String rootToken = trimmed.split("\\s+")[0];
        String rootCmd = rootToken.contains("/")
                ? rootToken.substring(rootToken.lastIndexOf('/') + 1)
                : rootToken;
        return ALLOWED_COMMANDS.contains(rootCmd);
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        WebSocketSession safeSession = new ConcurrentWebSocketSessionDecorator(session, 5_000, 512 * 1024);
        PtyProcess process = createProcess();
        Thread outputReader = Thread.ofVirtual()
                .name("terminal-output-" + session.getId())
            .start(() -> pumpProcessOutput(safeSession, process));
        TerminalSessionState state = new TerminalSessionState(process, outputReader, safeSession);
        sessions.put(session.getId(), state);
        sendToClient(state, "WSMS Restricted Terminal — only setup commands are permitted.\r\n");
        Object userEmail = session.getAttributes().get("userEmail");
        if (userEmail != null) {
            sendToClient(state, "Authenticated as: " + userEmail + "\r\n\r\n");
        }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        TerminalSessionState state = sessions.get(session.getId());
        if (state == null) return;
        String payload = message.getPayload();
        if (payload == null || payload.isEmpty()) return;
        if (tryHandleControlMessage(state.process(), payload)) return;

        // Only validate complete command lines (ending with newline), not individual keystrokes
        if (payload.endsWith("\n") || payload.endsWith("\r")) {
            String cmd = payload.stripTrailing();
            if (!isCommandAllowed(cmd)) {
                String warning = "\r\n\033[31m✖ Command blocked: \""
                        + cmd.trim() + "\" is not allowed in the restricted shell.\033[0m\r\n";
                sendToClient(state, warning);
                return;
            }
        }

        OutputStream processInput = state.process().getOutputStream();
        processInput.write(payload.getBytes(StandardCharsets.UTF_8));
        processInput.flush();
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        closeSession(session, CloseStatus.SERVER_ERROR);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        cleanupSession(session.getId());
    }

    private boolean tryHandleControlMessage(PtyProcess process, String payload) {
        if (!payload.startsWith("{")) return false;
        try {
            if (!payload.contains("\"type\":\"resize\"")) return false;
            int cols = Math.max(40, extractInt(payload, "cols", 120));
            int rows = Math.max(10, extractInt(payload, "rows", 35));
            process.setWinSize(new WinSize(cols, rows));
            return true;
        } catch (Exception ex) {
            return false;
        }
    }

    private PtyProcess createProcess() throws IOException {
        String[] command = resolveShellCommand();
        Map<String, String> environment = new HashMap<>(System.getenv());
        return new PtyProcessBuilder(command)
                .setDirectory(System.getProperty("user.dir"))
                .setEnvironment(environment)
                .setInitialColumns(120)
                .setInitialRows(35)
                .setConsole(false)
                .start();
    }

    private String[] resolveShellCommand() {
        if (configuredShell != null && !configuredShell.isBlank()) {
            return new String[]{configuredShell};
        }
        String osName = System.getProperty("os.name", "").toLowerCase();
        if (osName.contains("win")) {
            String windir = System.getenv("WINDIR");
            if (windir == null || windir.isBlank()) windir = "C:\\Windows";
            String powershell = windir + "\\System32\\WindowsPowerShell\\v1.0\\powershell.exe";
            if (new File(powershell).exists()) return new String[]{powershell};
            return new String[]{windir + "\\System32\\cmd.exe"};
        }
        return new String[]{"/bin/bash", "-l"};
    }

    private void pumpProcessOutput(WebSocketSession session, PtyProcess process) {
        try (InputStream inputStream = process.getInputStream()) {
            byte[] buffer = new byte[4096];
            int bytesRead;
            while (session.isOpen() && (bytesRead = inputStream.read(buffer)) != -1) {
                String output = new String(buffer, 0, bytesRead, StandardCharsets.UTF_8);
                if (session.isOpen()) session.sendMessage(new TextMessage(output));
            }
        } catch (IOException ignored) {
        } finally {
            cleanupSession(session.getId());
        }
    }

    private void sendToClient(TerminalSessionState state, String payload) throws IOException {
        if (state.session().isOpen()) {
            state.session().sendMessage(new TextMessage(payload));
        }
    }

    private void closeSession(WebSocketSession session, CloseStatus status) {
        try {
            if (session.isOpen()) session.close(status);
        } catch (IOException ignored) {
        } finally {
            cleanupSession(session.getId());
        }
    }

    private void cleanupSession(String sessionId) {
        TerminalSessionState state = sessions.remove(sessionId);
        if (state == null) return;
        state.process().destroy();
        state.outputReader().interrupt();
    }

    private int extractInt(String payload, String fieldName, int defaultValue) {
        String marker = "\"" + fieldName + "\":";
        int markerIndex = payload.indexOf(marker);
        if (markerIndex < 0) return defaultValue;
        int valueStart = markerIndex + marker.length();
        int valueEnd = valueStart;
        while (valueEnd < payload.length() && Character.isDigit(payload.charAt(valueEnd))) valueEnd++;
        if (valueStart == valueEnd) return defaultValue;
        return Integer.parseInt(payload.substring(valueStart, valueEnd));
    }

    private record TerminalSessionState(PtyProcess process, Thread outputReader, WebSocketSession session) {}
}   