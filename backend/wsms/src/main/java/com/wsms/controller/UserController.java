package com.wsms.controller;

import com.wsms.dto.admin.AppConfigDto;
import com.wsms.dto.user.ChangePasswordRequest;
import com.wsms.dto.user.UpdateProfileRequest;
import com.wsms.dto.user.UserProfileResponse;
// ...existing code...
import com.wsms.service.AppConfigService;
import com.wsms.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.wsms.exception.UserNotFoundException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    //removed repository use directly into controller
    //added service layer for user module
    private final UserService userService;
    private final AppConfigService appConfigService;

    /**
     * endpoint :- Get /api/users/search?username=xxx ;
     * req Body :- query parameter username;
     * res Body :- list of matching users with id, username, email;
     * Desc :- search users by username for admin server assignment;
     */
    @GetMapping("/search")
    public ResponseEntity<List<Map<String, Object>>> searchUsers(
            @RequestParam(value = "username", defaultValue = "") String username) {
        List<Map<String, Object>> users = userService.searchUsersByUsername(username);
        if (users.isEmpty()) {
            throw new UserNotFoundException("No users found with username: " + username);
        }
        return ResponseEntity.ok(users);
    }

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

    /**
     * endpoint :- Get /api/users/is_admin ;
     * req Body :- null;
     * res Body :- if admin return true or return false ;
     * Desc :- vaild-test for user is admin or not
     */
    @GetMapping("/is_admin")
    public ResponseEntity<Boolean> isAdmin(Authentication authentication) {

        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

        return ResponseEntity.ok(isAdmin);
    }

    /**
     * endpoint :- Get /api/users/config ;
     * req Body :- null;
     * res Body :- return config ;
     * Desc :- fetch ui config from db
     */
    @GetMapping("/config")
    public ResponseEntity<AppConfigDto> getConfig() {
        return ResponseEntity.ok(appConfigService.getConfig());
    }

}
