package wsms.agent.model;

import java.time.Instant;

public class Metrics {
    private String serverId;
    private Instant timestamp;
    private double cpuUsage;
    private double loadAvg1m;
    private double memoryUsage;
    private double diskUsage;
    private double diskReadPerSec;
    private double diskWritePerSec;
    private double networkTraffic;
    private int runningProcesses;
    private int sleepingProcesses;
    private int blockedProcesses;
    private int totalProcesses;

    public String getServerId() {
        return serverId;
    }

    public void setServerId(String serverId) {
        this.serverId = serverId;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public double getCpuUsage() {
        return cpuUsage;
    }

    public void setCpuUsage(double cpuUsage) {
        this.cpuUsage = cpuUsage;
    }

    public double getLoadAvg1m() {
        return loadAvg1m;
    }

    public void setLoadAvg1m(double loadAvg1m) {
        this.loadAvg1m = loadAvg1m;
    }

    public double getMemoryUsage() {
        return memoryUsage;
    }

    public void setMemoryUsage(double memoryUsage) {
        this.memoryUsage = memoryUsage;
    }

    public double getDiskUsage() {
        return diskUsage;
    }

    public void setDiskUsage(double diskUsage) {
        this.diskUsage = diskUsage;
    }

    public double getDiskReadPerSec() {
        return diskReadPerSec;
    }

    public void setDiskReadPerSec(double diskReadPerSec) {
        this.diskReadPerSec = diskReadPerSec;
    }

    public double getDiskWritePerSec() {
        return diskWritePerSec;
    }

    public void setDiskWritePerSec(double diskWritePerSec) {
        this.diskWritePerSec = diskWritePerSec;
    }

    public double getNetworkTraffic() {
        return networkTraffic;
    }

    public void setNetworkTraffic(double networkTraffic) {
        this.networkTraffic = networkTraffic;
    }

    public int getRunningProcesses() {
        return runningProcesses;
    }

    public void setRunningProcesses(int runningProcesses) {
        this.runningProcesses = runningProcesses;
    }

    public int getSleepingProcesses() {
        return sleepingProcesses;
    }

    public void setSleepingProcesses(int sleepingProcesses) {
        this.sleepingProcesses = sleepingProcesses;
    }

    public int getBlockedProcesses() {
        return blockedProcesses;
    }

    public void setBlockedProcesses(int blockedProcesses) {
        this.blockedProcesses = blockedProcesses;
    }

    public int getTotalProcesses() {
        return totalProcesses;
    }

    public void setTotalProcesses(int totalProcesses) {
        this.totalProcesses = totalProcesses;
    }
}
