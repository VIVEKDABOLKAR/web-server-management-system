package com.wsms.controller.adminController;

import com.wsms.dto.admin.AppConfigDto;
import com.wsms.service.AppConfigService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/config")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AppConfigController {

    private final AppConfigService appConfigService;

    @GetMapping
    public ResponseEntity<AppConfigDto> getConfig() {
        return ResponseEntity.ok(appConfigService.getConfig());
    }


    @PutMapping
    public ResponseEntity<AppConfigDto> updateConfig(@RequestBody AppConfigDto request) {
        return ResponseEntity.ok(appConfigService.updateConfig(request));
    }
}
