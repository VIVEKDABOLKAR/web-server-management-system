package com.wsms.service.interfaces;

import com.wsms.dto.user.ChangePasswordRequest;
import com.wsms.dto.user.UpdateProfileRequest;
import com.wsms.dto.user.UserProfileResponse;
import com.wsms.entity.User;

import java.util.List;
import java.util.Map;

public interface UserServiceInterface {

    List<Map<String, Object>> searchUsersByUsername(String username);

    UserProfileResponse getProfile();

    Map<String, String> updateProfile(UpdateProfileRequest request);

    Map<String, String> changePassword(ChangePasswordRequest request);

    User getCurrentUser();

    User getUserByServerId(Long serverId);

    void delete(Long userId);
}
