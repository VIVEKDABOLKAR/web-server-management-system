package com.wsms.service.interfaces;

import com.wsms.dto.admin.AppConfigDto;

public interface AppConfigServiceInterface {

    AppConfigDto getConfig();

    AppConfigDto updateConfig(AppConfigDto request);

    boolean isEmailServiceEnabled();

    boolean isAllowWebClientRequests();
}
