package com.wsms.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "metrics")
public class Metric {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Double cpuUsage;

    @Column(nullable = false)
    private Double loadAvg1m;

    @Column(nullable = false)
    private Double memoryUsage;

    @Column(nullable = false)
    private Double diskUsage;

    @Column(nullable = false)
    private Double diskReadPerSec;

    @Column(nullable = false)
    private Double diskWritePerSec;

    @Column(nullable = false)
    private Double networkTraffic;

    @Column(nullable = false)
    private Integer runningProcesses;

    @Column(nullable = false)
    private Integer sleepingProcesses;

    @Column(nullable = false)
    private Integer blockedProcesses;

    @Column(nullable = false)
    private Integer totalProcesses;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "server_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Server server;
}
