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
    private final int publishPort;
    private final String webServerHost;
    private final int webServerPort;
    private final Logger logger;
    private final AtomicBoolean active;
    private final ExecutorService connectionPool;

    private ServerSocket listener;

    //static
    private Integer reqCount = 0;


    public ConnectionMonitor(int publishPort,
                             String webServerHost,
                             int webServerPort,
                              Logger logger) {
        this.publishPort = publishPort;
        this.webServerPort = webServerPort;
        this.logger = logger;
        this.active = new AtomicBoolean(false);
        this.connectionPool = Executors.newFixedThreadPool(50);

        this.webServerHost = validateHost(webServerHost, webServerPort);
    }

    public void start() throws Exception {
        listener = new ServerSocket();
        listener.bind(new InetSocketAddress(publishPort));
        active.set(true);

        logger.infof("Connection monitor started on port %d", publishPort);
        logger.info("Waiting for incoming connections...");

        //Set acceptConnection method as thread , set it as demon process , start
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
                conn.setSoTimeout(30000);
                //increass request count
                reqCount++;
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
        String clientIp = conn.getInetAddress().getHostAddress();

        logger.info("========================================");
//        logger.info("INCOMING CONNECTION DETECTED");
        logger.info("Connection received from " + conn.getInetAddress().getHostAddress() + ":" + conn.getPort());


        try (Socket sourceConn = conn;
             //input output stream for our publishing port
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
            targetConn.connect(new InetSocketAddress(webServerHost, webServerPort), 5000);
            targetConn.setSoTimeout(30000);

//            System.out.println("getting connection :- " + targetConn.getLocalAddress().toString());

            //input output stream for target stream
            InputStream targetIn = targetConn.getInputStream();
            OutputStream targetOut = targetConn.getOutputStream();

            targetOut.write(buffer, 0, n);
            targetOut.flush();

            //two thread for sending req to 5173, and getting response to 4017 response stream
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
            while (!Thread.currentThread().isInterrupted() && (read = in.read(data)) != -1) {
                out.write(data, 0, read);
                out.flush();
            }
        } catch (Exception ignored) {
        }
    }

    private String validateHost(String host, int port) {
        String[] candidates; // InetAddress.getAllByName(host) <- we can use this to remove hardcoded things
        if ("localhost".equalsIgnoreCase(host)) {
            candidates = new String[] { "localhost", "127.0.0.1", "::1" };
        } else {
            candidates = new String[] { host };
        }

        for (String tempHost : candidates) {
            try (Socket testSocket = new Socket();) {
                System.out.println("Proxy target selected: " + tempHost + ":" + port);
                testSocket.connect(new InetSocketAddress(tempHost, port), 1000);
                System.out.println("Proxy connection established" +  tempHost + ":" + port);
                return tempHost;
            } catch (Exception ex) {
                System.out.println("Proxy target connect failed" + host + port + ex.getMessage());
            }
        }
        return host;
    }

    //setter RequestCounter
    public void setReqCount(Integer reqCount) {
        this.reqCount = reqCount;
    }

    public Integer getReqCount() {
        return reqCount;
    }
}