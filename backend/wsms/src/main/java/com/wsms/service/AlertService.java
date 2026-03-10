package com.wsms.service;

import com.wsms.entity.Alert;
import com.wsms.entity.AlertStatus;
import com.wsms.entity.AlertType;
import com.wsms.entity.Server;
import com.wsms.repository.AlertRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AlertService {

    //DI
    private final AlertRepository alertRepository;

    /**
     * create alert when matrics pass threshold value
     * @param server
     * @param alertType
     * @param message
     */
    public void createAlert(Server server, AlertType alertType, String message) {

        //build alert object
        Alert alert = Alert.builder()
                .server(server)
                .alertType(alertType)
                .message(message)
                .status(AlertStatus.ACTIVE)
                .build();

        //save alert object in db
        alertRepository.save(alert);
    }
}
