package com.wsms.controller;

import com.wsms.dto.user.ChangePasswordRequest;
import com.wsms.dto.user.UpdateProfileRequest;
import com.wsms.dto.user.UserProfileResponse;
import com.wsms.entity.ServerStatus;
import com.wsms.entity.User;
import com.wsms.repository.AlertRepository;
import com.wsms.repository.ServerRepository;
import com.wsms.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final ServerRepository serverRepository;
    private final AlertRepository alertRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getProfile() {
        User user = getCurrentUser();
        
        // Get statistics
        int totalServers = serverRepository.countByUserId(user.getId());
        int activeServers = serverRepository.countByUserIdAndStatus(user.getId(), ServerStatus.ACTIVE);
        int totalAlerts = alertRepository.countByServer_UserId(user.getId());
        
        UserProfileResponse response = UserProfileResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .isVerified(user.getIsVerified())
                .totalServers(totalServers)
                .activeServers(activeServers)
                .totalAlerts(totalAlerts)
                .build();
        
        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile")
    public ResponseEntity<Map<String, String>> updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
        User user = getCurrentUser();
        
        // Check if email is being changed and already exists
        if (!user.getEmail().equals(request.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already in use");
            }
        }
        
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        userRepository.save(user);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Profile updated successfully");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/change-password")
    public ResponseEntity<Map<String, String>> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        User user = getCurrentUser();
        
        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Current password is incorrect");
        }
        
        // Update password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Password changed successfully");
        return ResponseEntity.ok(response);
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }
}
