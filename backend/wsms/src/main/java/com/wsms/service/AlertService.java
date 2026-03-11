package com.wsms.service;

import com.wsms.entity.Alert;
import com.wsms.entity.AlertStatus;
import com.wsms.entity.AlertType;
import com.wsms.entity.Server;
import com.wsms.repository.AlertRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

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
}
