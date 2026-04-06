package com.wsms.service.interfaces;

import com.wsms.dto.admin.AdminRuntimeConfigDto;

public interface AdminRuntimeConfigServiceInterface {

    AdminRuntimeConfigDto getConfig();

    AdminRuntimeConfigDto updateConfig(AdminRuntimeConfigDto request);

    boolean isEmailServiceEnabled();

    boolean isAllowWebClientRequests();
}
