package com.wsms.controller;

import com.wsms.service.MetricCleanupService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/metrics")
@RequiredArgsConstructor
public class MetricAdminController {

    private final MetricCleanupService cleanupService;

    /**
     * Manually trigger cleanup of old metrics
     * DELETE /api/admin/metrics/cleanup?days=30
     */
    @DeleteMapping("/cleanup")
    public ResponseEntity<Map<String, Object>> cleanupOldMetrics(
            @RequestParam(value = "days", defaultValue = "30") int days) {
        
        int deletedCount = cleanupService.cleanupMetricsOlderThan(days);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Cleanup completed successfully");
        response.put("deletedCount", deletedCount);
        response.put("retentionDays", days);
        
        return ResponseEntity.ok(response);
    }
}
