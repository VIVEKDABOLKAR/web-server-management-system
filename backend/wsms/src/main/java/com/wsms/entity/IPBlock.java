package com.wsms.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(
    name = "ip_block",
    uniqueConstraints = @UniqueConstraint(
        name = "uk_ip_block_server_client_ip",
        columnNames = {"server_id", "client_ip"}
    )
)
public class IPBlock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "server_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Server server;

    @Column(name = "client_ip", nullable = false)
    private String clientIp;

    @Column(nullable = true)
    private String status = "UNBLOCK";


    @Column(name = "last_request")
    private LocalDateTime lastRequest;
}
