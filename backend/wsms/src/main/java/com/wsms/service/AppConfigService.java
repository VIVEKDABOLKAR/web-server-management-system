package com.wsms.service;

import com.wsms.dto.admin.AppConfigDto;
import com.wsms.entity.AppConfig;
import com.wsms.repository.AppConfigRepository;
import com.wsms.service.interfaces.AppConfigServiceInterface;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AppConfigService implements AppConfigServiceInterface {

    private static final long SINGLETON_CONFIG_ID = 1L;
    private static final String CACHE_NAME = "appConfig";

    private final AppConfigRepository appConfigRepository;

    private final boolean defaultAllowWebClientRequests;
    private final boolean defaultEmailServiceEnabled;
    private final String defaultServerAgentJarUrl;
    private final boolean defaultShowTerminalOnServerSetup;

    public AppConfigService(
            AppConfigRepository appConfigRepository,
            @Value("${app.config.allow-web-client-requests:true}") boolean allowWebClientRequests,
            @Value("${app.mail.enabled:true}") boolean emailServiceEnabled,
            @Value("${app.agent.jar-url:}") String serverAgentJarUrl,
            @Value("${app.config.show-terminal-on-server-setup:true}") boolean showTerminalOnServerSetup
    ) {
        this.appConfigRepository = appConfigRepository;
        this.defaultAllowWebClientRequests = allowWebClientRequests;
        this.defaultEmailServiceEnabled = emailServiceEnabled;
        this.defaultServerAgentJarUrl = serverAgentJarUrl == null ? "" : serverAgentJarUrl.trim();
        this.defaultShowTerminalOnServerSetup = showTerminalOnServerSetup;
    }

    @Transactional
    @Cacheable(value = CACHE_NAME)
    public AppConfigDto getConfig() {
        return toDto(getOrCreateConfigEntity());
    }

    @Transactional
    @CacheEvict(value = CACHE_NAME, allEntries = true)
    public AppConfigDto updateConfig(AppConfigDto request) {
        AppConfig config = getOrCreateConfigEntity();

        config.setAllowWebClientRequests(request.isAllowWebClientRequests());
        config.setEmailServiceEnabled(request.isEmailServiceEnabled());
        config.setServerAgentJarUrl(request.getServerAgentJarUrl() == null ? "" : request.getServerAgentJarUrl().trim());
        config.setShowTerminalOnServerSetup(request.isShowTerminalOnServerSetup());

        AppConfig saved = appConfigRepository.save(config);
        return toDto(saved);
    }

    @Transactional(readOnly = true)
    public boolean isEmailServiceEnabled() {
        return getConfig().isEmailServiceEnabled();
    }

    @Transactional(readOnly = true)
    public boolean isAllowWebClientRequests() {
        return getConfig().isAllowWebClientRequests();
    }


    private AppConfig getOrCreateConfigEntity() {
        return appConfigRepository.findById(SINGLETON_CONFIG_ID)
                .orElseGet(() -> appConfigRepository.save(createDefaultEntity()));
    }

    private AppConfig createDefaultEntity() {
        AppConfig config = new AppConfig();
        config.setId(SINGLETON_CONFIG_ID);
        config.setAllowWebClientRequests(defaultAllowWebClientRequests);
        config.setEmailServiceEnabled(defaultEmailServiceEnabled);
        config.setServerAgentJarUrl(defaultServerAgentJarUrl);
        config.setShowTerminalOnServerSetup(defaultShowTerminalOnServerSetup);
        return config;
    }

    private AppConfigDto toDto(AppConfig source) {
        AppConfigDto dto = new AppConfigDto();
        dto.setAllowWebClientRequests(source.isAllowWebClientRequests());
        dto.setEmailServiceEnabled(source.isEmailServiceEnabled());
        dto.setServerAgentJarUrl(source.getServerAgentJarUrl());
        dto.setShowTerminalOnServerSetup(source.isShowTerminalOnServerSetup());
        return dto;
    }
}
