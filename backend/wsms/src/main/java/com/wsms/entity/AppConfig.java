package com.wsms.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "admin_runtime_config")
@Getter
@Setter
public class AppConfig {

    @Id
    private Long id = 1L; // enforce single row

    @Column(nullable = false)
    private boolean allowWebClientRequests;

    @Column(nullable = false)
    private boolean emailServiceEnabled;

    @Column(nullable = false, length = 2000)
    private String serverAgentJarUrl;

    @Column(nullable = false)
    private boolean showTerminalOnServerSetup;
}