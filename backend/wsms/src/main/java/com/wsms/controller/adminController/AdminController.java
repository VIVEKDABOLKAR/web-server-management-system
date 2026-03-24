package com.wsms.controller.adminController;

import com.wsms.entity.OSType;
import com.wsms.entity.WebServerType;
import com.wsms.service.OSTypeService;
import com.wsms.service.ServerService;
import com.wsms.service.WebServerTypeService;
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
@PreAuthorize("hasRole('ADMIN')") //need to test
public class AdminController {
    @org.springframework.beans.factory.annotation.Autowired
    private com.wsms.repository.ServerRepository serverRepository;

    @org.springframework.beans.factory.annotation.Autowired
    private com.wsms.repository.UserRepository userRepository;
    private final OSTypeService osTypeService;
    private final WebServerTypeService webServerTypeService;

    /**
     * Get all servers (admin only)
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/servers")
    public org.springframework.http.ResponseEntity<?> getAllServers() {
        return org.springframework.http.ResponseEntity.ok(serverRepository.findAll());
    }

    /**
     * Get all users (admin only)
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users")
    public org.springframework.http.ResponseEntity<?> getAllUsers() {
        return org.springframework.http.ResponseEntity.ok(userRepository.findAll());
    }

    @org.springframework.beans.factory.annotation.Autowired
    private com.wsms.service.AdminService adminService;

    /**
     * Admin dashboard API: returns all users and all servers
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/dashboard-data")
    public org.springframework.http.ResponseEntity<?> getAdminDashboardData() {
        return org.springframework.http.ResponseEntity.ok(adminService.getDashboardData());
    }

    /**
     * vaild-test for user is admin or not
     */
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    // @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/is_admin")
    public String isAdmin(Authentication authentication) {
        System.out.println(authentication.getAuthorities());
        return "You are admin";
    }
}
