package com.wsms.controller.adminController;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    @org.springframework.beans.factory.annotation.Autowired
    private com.wsms.repository.ServerRepository serverRepository;

    @org.springframework.beans.factory.annotation.Autowired
    private com.wsms.repository.UserRepository userRepository;

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
