package com.wsms.controller.adminController;

import com.wsms.dto.user.UserRoleRequest;
import com.wsms.dto.user.UserStatusRequest;
import com.wsms.entity.OSType;
import com.wsms.entity.WebServerType;
import com.wsms.repository.ServerRepository;
import com.wsms.repository.UserRepository;
import com.wsms.service.AdminService;
import com.wsms.service.OSTypeService;
import com.wsms.service.ServerService;
import com.wsms.service.WebServerTypeService;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')") // need to test
public class AdminController {

    private final ServerRepository serverRepository;

    private final  UserRepository userRepository;
    private final OSTypeService osTypeService;
    private final WebServerTypeService webServerTypeService;
    private final AdminService adminService;

    /**
     * Get all servers (admin only)
     */
    @GetMapping("/servers")
    public org.springframework.http.ResponseEntity<?> getAllServers() {
        return org.springframework.http.ResponseEntity.ok(serverRepository.findAll());
    }

    /**
     * Get all users (admin only)
     */

    @GetMapping("/users")
    public org.springframework.http.ResponseEntity<?> getAllUsers() {
        return org.springframework.http.ResponseEntity.ok(userRepository.findAll());
    }

    /**
     * Admin dashboard API: returns all users and all servers
     */

    @GetMapping("/dashboard-data")
    public ResponseEntity<?> getAdminDashboardData() {
        return ResponseEntity.ok(adminService.getDashboardData());
    }

    @PutMapping("/users/{userId}/status")
    public ResponseEntity<?> updateUserStatus(@PathVariable Long userId, @RequestBody UserStatusRequest request) {
        adminService.updateUserStatus(userId, request.isActive());
        return ResponseEntity.ok("Updated");
    }

    @PutMapping("/users/{userId}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long userId, @RequestBody UserRoleRequest request) {
        adminService.updateUserRole(userId, request.getRole());
        return ResponseEntity.ok("Updated");
    }

    /**
     * vaild-test for user is admin or not
     */
    // @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping("/is_admin")
    @PreAuthorize("hasRole('ADMIN')")
    public boolean isAdmin() {
        return true;
    }

}
