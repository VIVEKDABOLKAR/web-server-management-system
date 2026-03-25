package com.wsms.service;

import com.wsms.entity.Alert;
import com.wsms.entity.AlertStatus;
import com.wsms.entity.AlertType;
import com.wsms.entity.Server;
import com.wsms.repository.AlertRepository;
import com.wsms.repository.ServerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AlertService {

    //DI
    private final AlertRepository alertRepository;
    private final ServerRepository serverRepository;

    /**
     * create alert when matrics pass threshold value
     * @param server
     * @param alertType
     * @param message
     */
    public Alert createAlert(Server server,AlertType alertType,Double value,Double threshold,String message) {

        //build alert object
        if(server == null){return null;}

        //build alert object
        Alert alert = Alert.builder()
                .server(server)
                .alertType(alertType)
                .message(message)
                .status(AlertStatus.OPEN)
                .threshold(threshold)
                .value(value)
                .build();

        //save alert object in db
        return alertRepository.save(alert);
    }

    public Alert createAlert(Server server, AlertType alertType, String message) {
        //set extra field as null
        return createAlert(server, alertType, null, null, message);

    }

    /**
     * find alert by alertId
     * @param id
     * @return
     */
    public  Alert findById(Long id){
        return alertRepository.findById(id).orElse(null);
    }

    /**
     * find all alert in server based on serverId
     *      its order in created by desc
     * @param server
     * @return
     */
    public List<Alert> findAllByServerIdOrderByCreatedAtDesc(Server server){
        return alertRepository.findAllByServerIdOrderByCreatedAtDesc(server.getId());
    }


    /**
     * changes the alert-status to OPEN
     * @param userId
     * @param alertId
     */
    public void markAlertAsOpen(Long userId, Long alertId) {

        Alert alert = alertRepository.findById(alertId).orElse(null);
        if (alert == null) return;

        if (!alert.getServer().getUser().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not allowed");
        }

        alert.setStatus(AlertStatus.OPEN); // ADD FIELD IN ENTITY
        alertRepository.save(alert);
    }

    /**
     * changes the alert-status to Acknowledged
     * @param userId
     * @param alertId
     */
    public void markAlertAsAcknowledged(Long userId, Long alertId) {

        Alert alert = alertRepository.findById(alertId).orElse(null);
        if (alert == null) return;

        if (!alert.getServer().getUser().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not allowed");
        }

        alert.setStatus(AlertStatus.ACKNOWLEDGED); // ADD FIELD IN ENTITY
        alertRepository.save(alert);
    }

    /**
     * changes the alert-status to Closed
     * @param userId
     * @param alertId
     */
    public void markAlertAsClosed(Long userId, Long alertId) {

        Alert alert = alertRepository.findById(alertId).orElse(null);
        if (alert == null) return;

        if (!alert.getServer().getUser().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not allowed");
        }

        alert.setStatus(AlertStatus.CLOSED);
        alertRepository.save(alert);
    }
}
