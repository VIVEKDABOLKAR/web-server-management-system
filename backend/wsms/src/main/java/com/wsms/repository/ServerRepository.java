package com.wsms.repository;

import com.wsms.entity.OSType;
import com.wsms.entity.Server;
import com.wsms.entity.ServerStatus;
import java.util.List;
import java.util.Optional;

import com.wsms.entity.WebServerType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface ServerRepository extends JpaRepository<Server, Long> {

    boolean existsByIpAddress(String ipAddress);

    List<Server> findAllByUser_Id(Long userId);

    Optional<Server> findByIdAndUser_Id(Long id, Long userId);

    int countByUser_Id(Long userId);

    int countByUser_IdAndStatus(Long userId, ServerStatus status);

    OSType save(OSType osType);

    WebServerType save(WebServerType webServerType);

    List<ServerHeartbeatView> findAllProjectedBy();

    //custom query
    @Modifying
    @Query("""
    UPDATE Server s 
    SET s.status = :status 
    WHERE s.id = :id
""")
    int updateServerStatus(Long id, ServerStatus status);

    /// we can also use this query it is kind of optimize :- in fututre we can
    @Modifying
    @Query("""
    UPDATE Server s SET s.status =
    CASE
        WHEN s.lastHeartbeat IS NULL THEN 'UNKNOWN'
        WHEN FUNCTION('TIMESTAMPDIFF', SECOND, s.lastHeartbeat, CURRENT_TIMESTAMP) < 5 THEN 'ACTIVE'
        WHEN FUNCTION('TIMESTAMPDIFF', SECOND, s.lastHeartbeat, CURRENT_TIMESTAMP) < 15 THEN 'WARNING'
        ELSE 'INACTIVE'
    END
    """)
    int updateAllServerStatuses();
}
