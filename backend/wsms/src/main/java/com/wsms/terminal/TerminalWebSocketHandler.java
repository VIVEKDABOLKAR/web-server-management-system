package com.wsms.terminal;

import com.pty4j.PtyProcess;
import com.pty4j.PtyProcessBuilder;
import com.pty4j.WinSize;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Component
@RequiredArgsConstructor
public class TerminalWebSocketHandler extends TextWebSocketHandler {

    private final Map<String, TerminalSessionState> sessions = new ConcurrentHashMap<>();

    @Value("${app.terminal.shell:}")
    private String configuredShell;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        PtyProcess process = createProcess();
        Thread outputReader = Thread.ofVirtual()
                .name("terminal-output-" + session.getId())
                .start(() -> pumpProcessOutput(session, process));

        sessions.put(session.getId(), new TerminalSessionState(process, outputReader));

        session.sendMessage(new TextMessage("WSMS Spring terminal connected\r\n"));
        Object userEmail = session.getAttributes().get("userEmail");
        if (userEmail != null) {
            session.sendMessage(new TextMessage("Authenticated as: " + userEmail + "\r\n\r\n"));
        }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        TerminalSessionState state = sessions.get(session.getId());
        if (state == null) {
            return;
        }

        String payload = message.getPayload();
        if (payload == null || payload.isEmpty()) {
            return;
        }

        if (tryHandleControlMessage(state.process(), payload)) {
            return;
        }

        //process() returns the PTY shell process created earlier
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
        if (!payload.startsWith("{")) {
            return false;
        }

        try {
            if (!payload.contains("\"type\":\"resize\"")) {
                return false;
            }

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

        PtyProcessBuilder builder = new PtyProcessBuilder(command)
                .setDirectory(System.getProperty("user.dir"))
                .setEnvironment(environment)
                .setInitialColumns(120)
                .setInitialRows(35)
                .setConsole(false);

        return builder.start();
    }

    private String[] resolveShellCommand() {
        if (configuredShell != null && !configuredShell.isBlank()) {
            return new String[]{configuredShell};
        }

        String osName = System.getProperty("os.name", "").toLowerCase();
        if (osName.contains("win")) {
            return new String[]{"powershell.exe"};
        }

        return new String[]{"/bin/bash", "-l"};
    }

    private void pumpProcessOutput(WebSocketSession session, PtyProcess process) {
        try (InputStream inputStream = process.getInputStream()) {
            byte[] buffer = new byte[4096];
            int bytesRead;
            while (session.isOpen() && (bytesRead = inputStream.read(buffer)) != -1) {
                String output = new String(buffer, 0, bytesRead, StandardCharsets.UTF_8);
                synchronized (session) {
                    if (session.isOpen()) {
                        session.sendMessage(new TextMessage(output));
                    }
                }
            }
        } catch (IOException ignored) {
            // Session closed or process exited.
        } finally {
            cleanupSession(session.getId());
        }
    }

    private void closeSession(WebSocketSession session, CloseStatus status) {
        try {
            if (session.isOpen()) {
                session.close(status);
            }
        } catch (IOException ignored) {
            // Ignore cleanup failure.
        } finally {
            cleanupSession(session.getId());
        }
    }

    private void cleanupSession(String sessionId) {
        TerminalSessionState state = sessions.remove(sessionId);
        if (state == null) {
            return;
        }

        state.process().destroy();
        state.outputReader().interrupt();
    }

    private int extractInt(String payload, String fieldName, int defaultValue) {
        String marker = "\"" + fieldName + "\":";
        int markerIndex = payload.indexOf(marker);
        if (markerIndex < 0) {
            return defaultValue;
        }

        int valueStart = markerIndex + marker.length();
        int valueEnd = valueStart;
        while (valueEnd < payload.length() && Character.isDigit(payload.charAt(valueEnd))) {
            valueEnd++;
        }

        if (valueStart == valueEnd) {
            return defaultValue;
        }

        return Integer.parseInt(payload.substring(valueStart, valueEnd));
    }

    private record TerminalSessionState(PtyProcess process, Thread outputReader) {
    }
}
