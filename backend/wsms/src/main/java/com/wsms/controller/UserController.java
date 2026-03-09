package com.wsms.controller;

import com.wsms.dto.user.ChangePasswordRequest;
import com.wsms.dto.user.UpdateProfileRequest;
import com.wsms.dto.user.UserProfileResponse;
import com.wsms.entity.ServerStatus;
import com.wsms.entity.User;
import com.wsms.repository.AlertRepository;
import com.wsms.repository.ServerRepository;
import com.wsms.repository.UserRepository;
import com.wsms.service.UserService;
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
    //removed repository use directly into controller
    //added service layer for user module
    private final UserService userService;

    /**
     * endpoint :- Get /api/users/profile ;
     * req Body :-;
     * res Body :- UserProfile ;
     * Desc :- return user details profile data;
     */
    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getProfile() {
        return ResponseEntity.ok(userService.getProfile());
    }

    /**
     * endpoint :- Put /api/users/profile ;
     * req Body :-updateProfile ;
     * res Body :- success or error message ;
     * Desc :- update user details and return success or error
     */
    @PutMapping("/profile")
    public ResponseEntity<Map<String,String>> updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(userService.updateProfile(request));
    }
    /**
     * endpoint :- Put /api/users/change-password ;
     * req Body :- old password and new password ;
     * res Body :- success or error message ;
     * Desc :- change password by verify from old password and set new password
     */
    @PutMapping("/change-password")
    public ResponseEntity<Map<String,String>> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        return ResponseEntity.ok(userService.changePassword(request));
    }


}
