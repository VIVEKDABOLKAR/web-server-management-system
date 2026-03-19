package wsms.agent.monitor;

import wsms.agent.utils.Logger;

import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.time.Instant;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicBoolean;

public class ConnectionMonitor {
    private final int port;
    private final Logger logger;
    private final AtomicBoolean active;
    private final ExecutorService connectionPool;
    private ServerSocket listener;

    public ConnectionMonitor(int port,  Logger logger) {
        this.port = port;
        this.logger = logger;
        this.active = new AtomicBoolean(false);
        this.connectionPool = Executors.newCachedThreadPool();
    }

    public void start() throws Exception {
        listener = new ServerSocket();
        listener.bind(new InetSocketAddress(port));
        active.set(true);

        logger.infof("Connection monitor started on port %d", port);
        logger.info("Waiting for incoming connections...");

        Thread acceptThread = new Thread(this::acceptConnections, "connection-monitor-accept");
        acceptThread.setDaemon(true);
        acceptThread.start();
    }

    public void stop() {
        active.set(false);
        if (listener != null && !listener.isClosed()) {
            try {
                listener.close();
            } catch (Exception ex) {
                logger.error("Error while stopping connection monitor", ex);
            }
        }
        connectionPool.shutdownNow();
        logger.info("Connection monitor stopped");
    }

    private void acceptConnections() {
        while (active.get()) {
            try {
                Socket conn = listener.accept();
                connectionPool.submit(() -> handleConnection(conn));
            } catch (Exception ex) {
                if (active.get()) {
                    logger.errorf("Error accepting connection: %s", ex.getMessage());
                }
            }
        }
    }

    private void handleConnection(Socket conn) {
        String remoteAddr = conn.getRemoteSocketAddress().toString();
        String localAddr = conn.getLocalSocketAddress().toString();
        String clientIp = conn.getInetAddress().getHostAddress();

        logger.info("========================================");
        logger.info("INCOMING CONNECTION DETECTED");
        logger.infof("Time: %s", Instant.now().toString());
        logger.infof("Client IP: %s", clientIp);
        logger.infof("Destination: %s", localAddr);

        try (Socket sourceConn = conn;
             InputStream sourceIn = sourceConn.getInputStream();
             OutputStream sourceOut = sourceConn.getOutputStream();
             Socket targetConn = new Socket()) {

            byte[] buffer = new byte[4096];
            int n = sourceIn.read(buffer);
            if (n <= 0) {
                return;
            }

            String requestData = new String(buffer, 0, n);
            String[] lines = requestData.split("\\n");
            if (lines.length > 0) {
                logger.infof("HTTP Request: %s", lines[0].trim());
            }

            /// Danger :- if hostname is localhost :- then try this addres localhost , 127.0.0.1, ::1, :::1
            /// we can chaekc which localhost connection is accepting by application we can put check at init pass one which we got success
            targetConn.connect(new InetSocketAddress("::1", 5173), 5000);

            InputStream targetIn = targetConn.getInputStream();
            OutputStream targetOut = targetConn.getOutputStream();

            targetOut.write(buffer, 0, n);
            targetOut.flush();

            Thread uplink = new Thread(() -> streamCopy(sourceIn, targetOut), "uplink");
            Thread downlink = new Thread(() -> streamCopy(targetIn, sourceOut), "downlink");

            uplink.start();
            downlink.start();

            uplink.join();
            downlink.join();
        } catch (Exception ex) {
            logger.errorf("Failed to handle connection %s: %s", remoteAddr, ex.getMessage());
        } finally {
            logger.infof("Connection closed for %s", remoteAddr);
            logger.info("========================================");
        }
    }

    private void streamCopy(InputStream in, OutputStream out) {
        byte[] data = new byte[8192];
        int read;
        try {
            while ((read = in.read(data)) != -1) {
                out.write(data, 0, read);
                out.flush();
            }
        } catch (Exception ignored) {
        }
    }

//    private void connectToTargetWithFallback(Socket targetConn) throws Exception {
//        String[] candidates;
//        if ("localhost".equalsIgnoreCase(targetHost)) {
//            candidates = new String[] { "localhost", "127.0.0.1", "::1" };
//        } else {
//            candidates = new String[] { targetHost };
//        }
//
//        Exception last = null;
//        for (String host : candidates) {
//            try {
//                targetConn.connect(new InetSocketAddress(host, targetPort), 5000);
//                logger.infof("Proxy target selected: %s:%d", host, targetPort);
//                return;
//            } catch (Exception ex) {
//                last = ex;
//                logger.errorf("Proxy target connect failed %s:%d - %s", host, targetPort, ex.getMessage());
//            }
//        }
//
//        if (last != null) {
//            throw last;
//        }
//        throw new IllegalStateException("No target host candidate available");
//    }
}