package com.wsms.repository;

import com.wsms.entity.Alert;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlertRepository extends JpaRepository<Alert, Long> {

    List<Alert> findAllByServerIdOrderByCreatedAtDesc(Long serverId);
}
