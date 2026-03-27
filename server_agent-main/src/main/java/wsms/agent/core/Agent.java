package wsms.agent.core;

import java.time.Instant;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;

import wsms.agent.collector.*;
import wsms.agent.config.Config;
import wsms.agent.config.ConfigUtils;
import wsms.agent.model.Metrics;
import wsms.agent.monitor.ConnectionMonitor;
import wsms.agent.network.MetricSender;
import wsms.agent.network.RequestLogsSender;
import wsms.agent.utils.Logger;

// Note: ConnectionMonitor is not yet implemented

public class Agent {
    private final LoadAvgCollector loadAvgCollector;
    private final NetworkTrafficCollector networkTrafficCollector;
    private final ProcessMetricsCollector processMetricsCollector;

    private final Config config;
    private final Logger logger;
    private final CPUCollector cpuCollector;
    private final MemoryCollector memoryCollector;
    private final DiskCollector diskCollector;
    private final RequestCollector  requestCollector;
    private final MetricSender metricSender;
    private final RequestLogsSender requestLogsSender;

    private final ConnectionMonitor connectionMonitor;

    private final AtomicBoolean stopped = new AtomicBoolean(false);

    // Previous values
    private long prevDiskRead = -1;
    private long prevDiskWrite = -1;
    private long prevNetwork = -1;
    private long prevTime = -1;
    private Integer prevReqCount = 0;

    public Agent(Config config) {
        this.config = config;
        this.logger = new Logger(config.getConfigPath());
        this.cpuCollector = new CPUCollector();
        this.memoryCollector = new MemoryCollector();
        this.diskCollector = new DiskCollector("/");

        this.loadAvgCollector = new LoadAvgCollector();
        this.networkTrafficCollector = new NetworkTrafficCollector();
        this.processMetricsCollector = new ProcessMetricsCollector();

        // Initialize metric sender if backend URL and auth token are provided
        if (config.getBackendUrl() != null && !config.getBackendUrl().isEmpty()
                && config.getAuthToken() != null && !config.getAuthToken().isEmpty()
                && config.getServerId() != null) {
            logger.info("Connecting to backend at " + config.getBackendUrl());
            this.metricSender = new MetricSender(
                    config.getBackendUrl(),
                    config.getAuthToken(),
                    Long.parseLong(config.getServerId()), //change it to the string , by testing
                    logger
            );
                this.requestLogsSender = new RequestLogsSender(
                    config.getBackendUrl(),
                    config.getAuthToken(),
                    logger
                );
            logger.info("Metric sender and request sender initialized with backend: " + config.getBackendUrl());
        } else {
            this.metricSender = null;
                this.requestLogsSender = null;
        }

        // Initialize connection monitor , if webApplicationMonitor is true
        if(config.isWebApplicationMonitor() ) {
            logger.info("Started ConnectionMonitor");
            this.connectionMonitor = new ConnectionMonitor(
                    config.getPublishPort(),
                    config.getWebServerHost(),
                    config.getWebServerPort(),
                    logger,
                    config.getServerId(),
                    requestLogsSender);
            this.requestCollector = new RequestCollector(connectionMonitor);
        } else {
            this.connectionMonitor = null;
            this.requestCollector = null;
        }
    }

    public static Agent newAgent(String configPath) {
        Config config = ConfigUtils.loadConfig(configPath);
        return new Agent(config);
    }

    public void start() {
        logger.info("========================================");
        logger.info("WSMS Agent Started");
        logger.infof("Server ID: %s", config.getServerId());
        logger.infof("Interval: %d sec", config.getCollectionInterval().getSeconds());
        //hardcode made it dynamic
        logger.infof("Web Application Public Url %s ", ("http://localhost" + ":" + config.getWebServerPort()));
        logger.info("========================================");

        try {
            if (connectionMonitor != null) {
                connectionMonitor.start();
            }
            //we are testing new connectionMonitor
//            NettyConnectionMonitor  nettyConnectionMonitor = new NettyConnectionMonitor(4017, "::1",5173, logger);
//            nettyConnectionMonitor.start();
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }


        while (!stopped.get()) {
            try {
                TimeUnit.SECONDS.sleep(config.getCollectionInterval().getSeconds());
//                 collectAndSend();
            } catch (Exception e) {
                Thread.currentThread().interrupt();
                stop();
            }
        }

        logger.info("Agent stopped.");
        logger.close();
    }

    public void stop() {
        stopped.set(true);
    }

    private void collectAndSend() {

        Metrics m = new Metrics();
        m.setServerId(config.getServerId());
        m.setTimestamp(Instant.now());

        long now = System.currentTimeMillis();

        // CPU
        try {
            m.setCpuUsage(cpuCollector.collect());
        } catch (InterruptedException e) {
            m.setCpuUsage(0);
            Thread.currentThread().interrupt();
        }

        // Load Avg
        m.setLoadAvg1m(loadAvgCollector.collect());

        // Memory
        m.setMemoryUsage(memoryCollector.collect());

        // Disk %
        m.setDiskUsage(diskCollector.collect());

        // Disk IO
        long read = 0, write = 0;
        for (oshi.hardware.HWDiskStore d : new oshi.SystemInfo().getHardware().getDiskStores()) {
            d.updateAttributes();
            read += d.getReadBytes();
            write += d.getWriteBytes();
        }

        // Network
        long net = networkTrafficCollector.collect();

        // Rate calc
        if (prevTime > 0) {
            double t = (now - prevTime) / 1000.0;

            m.setDiskReadPerSec((read - prevDiskRead) / t);
            m.setDiskWritePerSec((write - prevDiskWrite) / t);
            m.setNetworkTraffic((net - prevNetwork) / t);
        } else {
            m.setDiskReadPerSec(0);
            m.setDiskWritePerSec(0);
            m.setNetworkTraffic(0);
        }

        prevDiskRead = read;
        prevDiskWrite = write;
        prevNetwork = net;
        prevTime = now;

        // Processes
        wsms.agent.collector.ProcessMetricsCollector.ProcessMetrics procMetrics = processMetricsCollector.collect();
        m.setRunningProcesses(procMetrics.running);
        m.setSleepingProcesses(procMetrics.sleeping);
        m.setBlockedProcesses(procMetrics.blocked);
        m.setTotalProcesses(procMetrics.total);

        //request collector
        if (requestCollector != null) {
            int currentReqCount = requestCollector.collect();
            m.setRequestCount(currentReqCount - prevReqCount);
            prevReqCount = currentReqCount;
        } else {
            m.setRequestCount(0);
        }
        print(m);

        //server status
        m.setServerStatus("ACTIVE");

        if (metricSender != null) {
            metricSender.sendMetrics(m);
        }


    }

    private void print(Metrics m) {
        logger.info("========================================");

        logger.infof("Time: %s", m.getTimestamp());
        logger.infof("Server: %s", m.getServerId());

        logger.infof("CPU Usage: %.2f %%", m.getCpuUsage());
        logger.infof("Load Avg (1m): %.2f", m.getLoadAvg1m());
        logger.infof("Memory Usage: %.2f %%", m.getMemoryUsage());
        logger.infof("Disk Usage: %.2f %%", m.getDiskUsage());

        logger.infof("Disk Reads/s: %s", human(m.getDiskReadPerSec()));
        logger.infof("Disk Writes/s: %s", human(m.getDiskWritePerSec()));
        logger.infof("Network Traffic: %s/s", human(m.getNetworkTraffic()));

        logger.infof("Running Processes: %d", m.getRunningProcesses());
        logger.infof("Sleeping Processes: %d", m.getSleepingProcesses());
        logger.infof("Blocked Processes: %d", m.getBlockedProcesses());
        logger.infof("Total Processes: %d", m.getTotalProcesses());

        logger.infof("Requests Count: %d", m.getRequestCount());

        logger.info("========================================");
    }

    private String human(double b) {
        if (b < 1024)
            return String.format("%.0f B", b);
        int e = (int) (Math.log(b) / Math.log(1024));
        String p = "KMGTPE".charAt(e - 1) + "B";
        return String.format("%.1f %s", b / Math.pow(1024, e), p);
    }
}