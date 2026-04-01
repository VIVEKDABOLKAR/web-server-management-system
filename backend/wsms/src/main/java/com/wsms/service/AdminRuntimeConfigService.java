package com.wsms.service;

import com.wsms.dto.admin.AdminRuntimeConfigDto;
import com.wsms.entity.AdminRuntimeConfig;
import com.wsms.repository.AdminRuntimeConfigRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminRuntimeConfigService {

    private static final long SINGLETON_CONFIG_ID = 1L;

    private final AdminRuntimeConfigRepository adminRuntimeConfigRepository;

    private final boolean defaultAllowWebClientRequests;
    private final boolean defaultEmailServiceEnabled;
    private final String defaultServerAgentJarUrl;
    private final boolean defaultShowTerminalOnServerSetup;

    public AdminRuntimeConfigService(
            AdminRuntimeConfigRepository adminRuntimeConfigRepository,
            @Value("${app.config.allow-web-client-requests:true}") boolean allowWebClientRequests,
            @Value("${app.mail.enabled:true}") boolean emailServiceEnabled,
            @Value("${app.agent.jar-url:}") String serverAgentJarUrl,
            @Value("${app.config.show-terminal-on-server-setup:true}") boolean showTerminalOnServerSetup
    ) {
        this.adminRuntimeConfigRepository = adminRuntimeConfigRepository;
        this.defaultAllowWebClientRequests = allowWebClientRequests;
        this.defaultEmailServiceEnabled = emailServiceEnabled;
        this.defaultServerAgentJarUrl = serverAgentJarUrl == null ? "" : serverAgentJarUrl.trim();
        this.defaultShowTerminalOnServerSetup = showTerminalOnServerSetup;
    }

    @Transactional
    public AdminRuntimeConfigDto getConfig() {
        return toDto(getOrCreateConfigEntity());
    }

    @Transactional
    public AdminRuntimeConfigDto updateConfig(AdminRuntimeConfigDto request) {
        AdminRuntimeConfig config = getOrCreateConfigEntity();

        config.setAllowWebClientRequests(request.isAllowWebClientRequests());
        config.setEmailServiceEnabled(request.isEmailServiceEnabled());
        config.setServerAgentJarUrl(request.getServerAgentJarUrl() == null ? "" : request.getServerAgentJarUrl().trim());
        config.setShowTerminalOnServerSetup(request.isShowTerminalOnServerSetup());

        AdminRuntimeConfig saved = adminRuntimeConfigRepository.save(config);
        return toDto(saved);
    }

    @Transactional(readOnly = true)
    public boolean isEmailServiceEnabled() {
        return getOrCreateConfigEntity().isEmailServiceEnabled();
    }

    @Transactional(readOnly = true)
    public boolean isAllowWebClientRequests() {
        return getOrCreateConfigEntity().isAllowWebClientRequests();
    }

    private AdminRuntimeConfig getOrCreateConfigEntity() {
        return adminRuntimeConfigRepository.findById(SINGLETON_CONFIG_ID)
                .orElseGet(() -> adminRuntimeConfigRepository.save(createDefaultEntity()));
    }

    private AdminRuntimeConfig createDefaultEntity() {
        AdminRuntimeConfig config = new AdminRuntimeConfig();
        config.setId(SINGLETON_CONFIG_ID);
        config.setAllowWebClientRequests(defaultAllowWebClientRequests);
        config.setEmailServiceEnabled(defaultEmailServiceEnabled);
        config.setServerAgentJarUrl(defaultServerAgentJarUrl);
        config.setShowTerminalOnServerSetup(defaultShowTerminalOnServerSetup);
        return config;
    }

    private AdminRuntimeConfigDto toDto(AdminRuntimeConfig source) {
        AdminRuntimeConfigDto dto = new AdminRuntimeConfigDto();
        dto.setAllowWebClientRequests(source.isAllowWebClientRequests());
        dto.setEmailServiceEnabled(source.isEmailServiceEnabled());
        dto.setServerAgentJarUrl(source.getServerAgentJarUrl());
        dto.setShowTerminalOnServerSetup(source.isShowTerminalOnServerSetup());
        return dto;
    }
}
