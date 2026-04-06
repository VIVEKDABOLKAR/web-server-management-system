package com.wsms.service.interfaces;

import java.util.Map;

public interface AdminServiceInterface {

    Map<String, Object> getDashboardData();

    void updateUserStatus(Long userId, boolean isActive);

    void updateUserRole(Long userId, String roleValue);
}
