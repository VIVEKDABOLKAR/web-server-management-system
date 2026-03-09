package com.wsms.entity;

public enum AlertType {
    CPU_HIGH,
    MEMORY_HIGH,
    DISK_HIGH, // ADD Alert Type for Disk as well
    RPS_HIGH,
    SERVER_DOWN //Whene agent did not send any response for fixed interval
}
