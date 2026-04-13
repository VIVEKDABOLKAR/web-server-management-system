package com.wsms.service.interfaces;

import com.wsms.entity.Alert;
import com.wsms.entity.AlertType;
import com.wsms.entity.Server;

import java.util.List;

public interface AlertServiceInterface {

    Alert createAlert(Server server, AlertType alertType, Double value, Double threshold, String message);

    Alert createAlert(Server server, AlertType alertType, String message);

    Alert findById(Long id);

    List<Alert> findAllByServerIdOrderByCreatedAtDesc(Server server);

    void markAlertAsOpen(Long userId, Long alertId);

    void markAlertAsAcknowledged(Long userId, Long alertId);

    void markAlertAsClosed(Long userId, Long alertId);

    void closeActiveAlertsByType(Long serverId, AlertType alertType);

    Alert createOrUpdateAlert(Server server, AlertType alertType, Double value, Double threshold, String message);
}
