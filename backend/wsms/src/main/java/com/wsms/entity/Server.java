package com.wsms.entity;

import jakarta.persistence.CascadeType;
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
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "servers", uniqueConstraints = {
                @UniqueConstraint(name = "uk_servers_ip_address", columnNames = "ip_address"),
                @UniqueConstraint(name = "uk_servers_agent_token", columnNames = "agent_token")
})
public class Server {
        @com.fasterxml.jackson.annotation.JsonProperty("userId")
        public Long getUserId() {
                return user != null ? user.getId() : null;
        }

        @Column(nullable = true)
        private LocalDateTime lastHeartbeat;

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @Column(nullable = false, length = 100)
        private String serverName;

        @Column(name = "ip_address", nullable = false, length = 45)
        private String ipAddress;

        @ManyToOne(fetch = FetchType.LAZY, optional = false)
        @JoinColumn(name = "os_type_id", nullable = false)
        @ToString.Exclude
        @EqualsAndHashCode.Exclude
        private OSType osType;

        @ManyToOne(fetch = FetchType.LAZY, optional = false)
        @JoinColumn(name = "web_server_type_id", nullable = false)
        @ToString.Exclude
        @EqualsAndHashCode.Exclude
        private WebServerType webServerType;

        // web server port - we need this field so e can tell server agent on which it
        // has to perform network monitoring and port forwarding
        @Column(nullable = true)
        @Min(value = 1, message = "Port number must be >= 1")
        @Max(value = 65535, message = "Port number must be <= 65535")
        private Integer webServerPortNo = 4017;

        @Enumerated(EnumType.STRING)
        @Column(nullable = false, length = 20)
        @Builder.Default
        private ServerStatus status = ServerStatus.INACTIVE;

        @Column(name = "agent_token", nullable = false, length = 255)
        private String agentToken;

        @Column(columnDefinition = "TEXT")
        private String description;

        @CreationTimestamp
        @Column(nullable = false, updatable = false)
        private LocalDateTime createdAt;

        @UpdateTimestamp
        @Column(nullable = false)
        private LocalDateTime updatedAt;

        @ManyToOne(fetch = FetchType.LAZY, optional = false)
        @JoinColumn(name = "user_id", nullable = false)
        @com.fasterxml.jackson.annotation.JsonIgnore
        @ToString.Exclude
        @EqualsAndHashCode.Exclude
        private User user;

        @OneToOne(mappedBy = "server", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
        @com.fasterxml.jackson.annotation.JsonIgnore
        @ToString.Exclude
        @EqualsAndHashCode.Exclude
        private Agent agent;

        @Builder.Default
        @OneToMany(mappedBy = "server", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
        @com.fasterxml.jackson.annotation.JsonIgnore
        @ToString.Exclude
        @EqualsAndHashCode.Exclude
        private List<Metric> metrics = new ArrayList<>();

        @Builder.Default
        @OneToMany(mappedBy = "server", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
        @com.fasterxml.jackson.annotation.JsonIgnore
        @ToString.Exclude
        @EqualsAndHashCode.Exclude
        private List<IPBlock> blockedIps = new ArrayList<>();

        @Builder.Default
        @OneToMany(mappedBy = "server", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
        @com.fasterxml.jackson.annotation.JsonIgnore
        @ToString.Exclude
        @EqualsAndHashCode.Exclude
        private List<Alert> alerts = new ArrayList<>();

        @Builder.Default
        @OneToMany(mappedBy = "server", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
        @com.fasterxml.jackson.annotation.JsonIgnore
        @ToString.Exclude
        @EqualsAndHashCode.Exclude
        private List<RequestLog> requestLogs = new ArrayList<>();
}
