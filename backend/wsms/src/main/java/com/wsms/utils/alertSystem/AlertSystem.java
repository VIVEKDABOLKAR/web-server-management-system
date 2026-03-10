package com.wsms.utils.alertSystem;

import com.wsms.dto.metric.MetricSubmitRequest;
import com.wsms.entity.AlertType;
import com.wsms.entity.Server;
import com.wsms.service.AlertService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AlertSystem {

    //DI
    private final AlertService alertService;

    /**
     * it will evaluate matrics , and if it pass threshold value
     * create alert object and reutrn true
     * @param server
     * @param metricSubmitRequest
     * @return false
     */
    public boolean evaluate(Server server, MetricSubmitRequest metricSubmitRequest) {
        //flag for alert occurrence
        boolean alertFlag = false;

        //for now, we put threshold value hardcoded , later we will use config

        //for cpu usage
        if (metricSubmitRequest.getCpuUsage() > 90) {
            alertService.createAlert(
                    server,
                    AlertType.CPU_HIGH,
                    "CPU usage exceeded 80%. Current: " + metricSubmitRequest.getCpuUsage()
            );
            alertFlag = true;
        }

        //for memory usage
        if (metricSubmitRequest.getMemoryUsage() > 80) {
            alertService.createAlert(
                    server,
                    AlertType.MEMORY_HIGH,
                    "Memory usage exceeded 80%. Current: " + metricSubmitRequest.getMemoryUsage()
            );
            alertFlag = true;
        }

        //for Disk usage
        if (metricSubmitRequest.getDiskUsage() > 80) {
            alertService.createAlert(
                    server,
                    AlertType.DISK_HIGH,
                    "Disk usage exceeded 80%. Current: " + metricSubmitRequest.getDiskUsage()
            );
            alertFlag = true;
        }

        //by default no alert occurred
        return alertFlag;
    }
}
