package com.wsms.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.wsms.dto.user.ChangePasswordRequest;
import com.wsms.dto.user.UpdateProfileRequest;
import com.wsms.dto.user.UserProfileResponse;
import com.wsms.entity.ServerStatus;
import com.wsms.entity.User;
import com.wsms.repository.AlertRepository;
import com.wsms.repository.ServerRepository;
import com.wsms.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    // DI
    private final UserRepository userRepository;
    private final ServerRepository serverRepository;
    private final AlertRepository alertRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * fetch user profile and server details base on user email
     * 
     * @return
     */
    public UserProfileResponse getProfile() {

        User user = getCurrentUser();

        // fetch server and details of the user
        int totalServers = serverRepository.countByUser_Id(user.getId());
        int activeServers = serverRepository.countByUser_IdAndStatus(user.getId(), ServerStatus.ACTIVE);
        int totalAlerts = alertRepository.countByServer_User_Id(user.getId());

        // create and send response
        return UserProfileResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .isVerified(user.getIsVerified())
                .totalServers(totalServers)
                .activeServers(activeServers)
                .totalAlerts(totalAlerts)
                .build();
    }

    /**
     * update user profile based on user email
     */
    public Map<String, String> updateProfile(UpdateProfileRequest request) {

        User user = getCurrentUser();

        if (!user.getEmail().equals(request.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already in use");
            }
            user.setEmail(request.getEmail());
        }

        if (!user.getUsername().equals(request.getUsername())) {
            if (userRepository.existsByUsername(request.getUsername())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username already in use");
            }
            user.setUsername(request.getUsername());
        }

        user.setFullName(request.getFullName());

        userRepository.save(user);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Profile updated successfully");

        return response;
    }

    /**
     * update user profile based on user email
     */
    public Map<String, String> changePassword(ChangePasswordRequest request) {

        User user = getCurrentUser();

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Password changed successfully");

        return response;
    }

    // NEXT TASK :- Refactor code to implement this
    /**
     * take email from the authentication object and use it fetch user or throw
     * error
     * insted of this can we add seecurity filter to fetch user cred from jwt token
     * and store it in authentication
     *
     */
    public User getCurrentUser() { // made it public so other contoller can also get current user

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    public User getUserByServerId(Long serverId) {

        return userRepository.findByServersId(serverId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found By server ID"));
    }
}