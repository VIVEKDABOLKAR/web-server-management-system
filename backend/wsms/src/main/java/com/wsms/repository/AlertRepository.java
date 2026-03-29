package com.wsms.repository;

import com.wsms.entity.Alert;
import com.wsms.entity.AlertStatus;
import com.wsms.entity.AlertType;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlertRepository extends JpaRepository<Alert, Long> {

    List<Alert> findAllByServerIdOrderByCreatedAtDesc(Long serverId);

    List<Alert> findAllByServerIdAndAlertTypeAndStatusInOrderByCreatedAtDesc(
            Long serverId,
            AlertType alertType,
            List<AlertStatus> statuses
    );
    
    int countByServer_User_Id(Long userId);
}
