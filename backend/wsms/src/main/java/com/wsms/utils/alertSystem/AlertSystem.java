package com.wsms.utils.alertSystem;

import com.wsms.dto.metric.MetricSubmitRequest;
import com.wsms.entity.Alert;
import com.wsms.entity.AlertType;
import com.wsms.entity.Server;
import com.wsms.entity.ServerStatus;
import com.wsms.repository.ServerHeartbeatView;
import com.wsms.repository.ServerRepository;
import com.wsms.service.AlertService;
import com.wsms.service.EmailService;
import com.wsms.service.ServerService;
import com.wsms.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AlertSystem {

    //DI
    private final AlertService alertService;
    private final ServerService serverService;
    private final EmailService emailService;
    private final UserService userService;

//      evalue server-status
//      ACTIVE: heartbeat is fresh.
//      WARNING: heartbeat delayed but not fully stale.
//      DOWN: heartbeat stale past timeout.
//      UNKNOWN: never received heartbeat yet.

    // Create schuldure :- runs every 5 second


    @Scheduled(fixedRate = 4500)
    public void evaluateServerHealth() {
        // fetch every server-last heartbeat
        List<ServerHeartbeatView> servers = serverService.getAllServerHeartBeat();

        LocalDateTime now = LocalDateTime.now();

        //interate through each server
        for  (ServerHeartbeatView server : servers) {
            Long serverId = server.getId();
            LocalDateTime lastHeartbeat = server.getLastHeartbeat();
            ServerStatus prevServerStatus = server.getStatus();

            //temp var server-status
            ServerStatus status;
            // compare with current-time

            //if heartbeat is null - mark status as Unknown
            //if diff less than 5 - do nothing
            //if diff bw 5 - 15 - mark serverStatus as warning
            //if more than 15 = mark it as InActive
            if(lastHeartbeat == null) {
                status = ServerStatus.UNKNOWN;
            } else {
                long diff = Duration.between(lastHeartbeat, now).toSeconds();

                if(diff < 5) {
                    status = ServerStatus.ACTIVE;
                }
                else if(diff < 15) {
                    status = ServerStatus.WARNING;
                } else {
                    status = ServerStatus.INACTIVE;
                }
            }

            // based on this update server-status
            if(prevServerStatus != status) {
                serverService.updateServerStatus(serverId, status);
                if(status == ServerStatus.INACTIVE ) {
                    Server serverObj = serverService.getServerById(serverId);
                    Alert alert = alertService.createOrUpdateAlert(
                            serverObj, AlertType.SERVER_DOWN, null,null,"Your Server is down");
                    System.out.println("Alert Occured ;- ");

                    //send email-notification
                    if (emailService != null) {
                        String email = userService.getUserByServerId(serverId).getEmail();
                        emailService.sendAlert(alert, email,"Medium");
                    }
                }
                if (status == ServerStatus.ACTIVE ) {
                    // Server recovered: close active SERVER_DOWN alerts automatically.
                    System.out.println("Server recovered, closing SERVER_DOWN alerts");
                    alertService.closeActiveAlertsByType(serverId, AlertType.SERVER_DOWN);
                }
            }

        }
    }

    /**
     * it will evaluate matrics , and if it passed threshold value
     * create alert object and reutrn true
     * @param server
     * @param metricSubmitRequest
     * @return false
     */
    public boolean evaluate(Server server, MetricSubmitRequest metricSubmitRequest) {
        if (metricSubmitRequest == null) {return false;}

        //flag for alert occurrence
        boolean alertFlag = false;

        //for now, we put threshold value hardcoded , later we will use config


        //CREATE FUNCTION TO CHECK WITH THRESHOLD
        //for cpu usage
        if (metricSubmitRequest.getCpuUsage() > 90) {
            alertService.createOrUpdateAlert(
                   server,
                    AlertType.CPU_HIGH,
                    metricSubmitRequest.getCpuUsage(),
                    90.0,
                    "CPU exceeds the limit"
            );
            alertFlag = true;
        } else {
            alertService.closeActiveAlertsByType(server.getId(), AlertType.CPU_HIGH);
        }

        //for memory usage
        if (metricSubmitRequest.getMemoryUsage() > 80) {
            alertService.createOrUpdateAlert(
                    server,
                    AlertType.MEMORY_HIGH,
                    metricSubmitRequest.getMemoryUsage(),
                    80.0,
                    "MEMORY exceeds the limit"
            );
            alertFlag = true;
        } else {
            alertService.closeActiveAlertsByType(server.getId(), AlertType.MEMORY_HIGH);
        }

        //for Disk usage
        if (metricSubmitRequest.getDiskUsage() > 80) {
            alertService.createOrUpdateAlert(
                    server,
                    AlertType.DISK_HIGH,
                    metricSubmitRequest.getDiskUsage(),
                    80.0,
                    "DISK exceeds the limit"
            );
            alertFlag = true;
        } else {
            alertService.closeActiveAlertsByType(server.getId(), AlertType.DISK_HIGH);
        }

        //by default no alert occurred
        return alertFlag;
    }
}
