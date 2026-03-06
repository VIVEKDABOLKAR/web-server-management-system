package com.wsms.repository;

import com.wsms.entity.Metric;
import com.wsms.entity.Server;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MetricRepository extends JpaRepository<Metric, Long> {
    List<Metric> findByServerOrderByCreatedAtDesc(Server server);
    
    List<Metric> findByServerAndCreatedAtBetweenOrderByCreatedAtDesc(
            Server server, 
            LocalDateTime startDate, 
            LocalDateTime endDate
    );
    
    List<Metric> findTop100ByServerOrderByCreatedAtDesc(Server server);
    
    /**
     * Delete metrics older than the specified date
     * @param cutoffDate Delete metrics created before this date
     * @return Number of deleted records
     */
    @Modifying
    @Query("DELETE FROM Metric m WHERE m.createdAt < :cutoffDate")
    int deleteByCreatedAtBefore(@Param("cutoffDate") LocalDateTime cutoffDate);
    
    /**
     * Count metrics older than the specified date
     */
    @Query("SELECT COUNT(m) FROM Metric m WHERE m.createdAt < :cutoffDate")
    long countByCreatedAtBefore(@Param("cutoffDate") LocalDateTime cutoffDate);
    
    /**
     * Get total count of metrics per server
     */
    @Query("SELECT COUNT(m) FROM Metric m WHERE m.server = :server")
    long countByServer(@Param("server") Server server);
}
