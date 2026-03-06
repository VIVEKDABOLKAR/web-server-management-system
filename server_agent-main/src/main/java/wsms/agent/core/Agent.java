package wsms.agent.core;

import wsms.agent.collector.CPUCollector;
import wsms.agent.collector.DiskCollector;
import wsms.agent.collector.MemoryCollector;
import wsms.agent.config.Config;
import wsms.agent.model.Metrics;
import wsms.agent.network.ConnectionMonitor;
import wsms.agent.network.IPUtils;
import wsms.agent.network.MetricSender;
import wsms.agent.utils.Logger;

import java.time.Instant;
import java.util.List;
import java.util.Scanner;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;

public class Agent {
    private final Config config;
    private final Logger logger;
    private final CPUCollector cpuCollector;
    private final MemoryCollector memoryCollector;
    private final DiskCollector diskCollector;
    private final MetricSender metricSender;
    private ConnectionMonitor monitor;
    private final CountDownLatch stopLatch;
    private final AtomicBoolean stopped;

    private Agent(Config config) {
        this.config = config;
        this.logger = new Logger(config.getLogFile());
        this.cpuCollector = new CPUCollector();
        this.memoryCollector = new MemoryCollector();
        this.diskCollector = new DiskCollector("/");
        this.stopLatch = new CountDownLatch(1);
        this.stopped = new AtomicBoolean(false);
        
        // Initialize metric sender if backend URL and auth token are provided
        if (config.getBackendUrl() != null && !config.getBackendUrl().isEmpty() 
                && config.getAuthToken() != null && !config.getAuthToken().isEmpty()
                && config.getServerIdLong() != null) {
            this.metricSender = new MetricSender(
                config.getBackendUrl(), 
                config.getAuthToken(), 
                config.getServerIdLong(),
                logger
            );
            logger.info("Metric sender initialized with backend: " + config.getBackendUrl());
        } else {
            this.metricSender = null;
            logger.info("Metric sender disabled (backend URL or auth token not configured)");
        }
    }

    public static Agent newAgent(String configPath) {
        Config config = Config.load(configPath);
        return new Agent(config);
    }

    public void start() {
        logger.info("========================================");
        logger.info("Web Server Management Agent - Starting");
        logger.info("========================================");
        logger.infof("Server ID: %s", config.getServerId());
        logger.infof("Collection Interval: %d seconds", config.getCollectionInterval().getSeconds());
        logger.info("========================================");

        Scanner scanner = new Scanner(System.in);
        System.out.println("Choose an option:");
        System.out.println("1. Start collecting metrics");
        System.out.println("2. Start monitoring incoming connections");

        int choice = 1;
        try {
            choice = Integer.parseInt(scanner.nextLine().trim());
        } catch (Exception ignored) {
        }

        switch (choice) {
            case 2 -> {
                int port = 0;
                try {
                    System.out.print("Enter port to monitor: ");
                    port = Integer.parseInt(scanner.nextLine().trim());
                } catch (Exception ex) {
                    logger.error("Invalid port provided, monitor not started");
                }

                if (port > 0) {
                    System.out.printf("Starting connection monitor on port %d... to the port 5173 %n", port);
                    monitor = new ConnectionMonitor(port, logger);
                    try {
                        monitor.start();
                    } catch (Exception ex) {
                        logger.errorf("Failed to start connection monitor: %s", ex.getMessage());
                        stop();
                    }
                } else {
                    stop();
                }
            }
            default -> collectAndPrintInInterval();
        }

        awaitStop();
        logger.info("Received stop signal...");
        logger.info("Agent stopping...");
        logger.close();
    }

    public void stop() {
        if (stopped.compareAndSet(false, true)) {
            if (monitor != null) {
                monitor.stop();
            }
            stopLatch.countDown();
        }
    }

    private void awaitStop() {
        try {
            stopLatch.await();
        } catch (InterruptedException ex) {
            Thread.currentThread().interrupt();
        }
    }

    private void collectAndPrintInInterval() {
        while (!stopped.get()) {
            logger.info("Waiting for next collection cycle...");
            try {
                TimeUnit.SECONDS.sleep(config.getCollectionInterval().getSeconds());
            } catch (InterruptedException ex) {
                Thread.currentThread().interrupt();
                stop();
                break;
            }

            if (stopped.get()) {
                break;
            }

            logger.info("Starting new collection cycle...");
            collectAndPrint();
        }
    }

    private void collectAndPrint() {
        Metrics metrics = new Metrics();
        metrics.setServerId(config.getServerId());
        metrics.setTimestamp(Instant.now());

        try {
            metrics.setCpu(cpuCollector.collect());
        } catch (Exception ex) {
            logger.errorf("Failed to collect CPU: %s", ex.getMessage());
        }

        try {
            metrics.setMemory(memoryCollector.collect());
        } catch (Exception ex) {
            logger.errorf("Failed to collect Memory: %s", ex.getMessage());
        }

        try {
            metrics.setDisk(diskCollector.collect());
        } catch (Exception ex) {
            logger.errorf("Failed to collect Disk: %s", ex.getMessage());
        }

        try {
            List<String> primaryIPs = IPUtils.getAllPrimaryIPs();
            logger.infof("Primary IP Address: %s", primaryIPs);
        } catch (Exception ex) {
            logger.errorf("Failed to get primary IP: %s", ex.getMessage());
        }

        printMetrics(metrics);
        
        // Send metrics to backend if configured
        if (metricSender != null) {
            metricSender.sendMetrics(metrics);
        }
    }

    private void printMetrics(Metrics metrics) {
        logger.info("========================================");
        logger.infof("Time: %s", metrics.getTimestamp().toString());
        logger.infof("Server: %s", metrics.getServerId());
        logger.infof("CPU Usage: %.2f%%", metrics.getCpu());
        logger.infof("Memory Usage: %.2f%%", metrics.getMemory());
        logger.infof("Disk Usage: %.2f%%", metrics.getDisk());
        logger.info("========================================");
    }
}
