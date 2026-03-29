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


@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AddServerFormController {

    private final OSTypeService osTypeService;
    private final WebServerTypeService webServerTypeService;

    @GetMapping("/ostypes")
    public ResponseEntity<List<OSType>> getAllOSType(){
        List<OSType> allOSType= osTypeService.getAllOSType();
        return ResponseEntity.ok(allOSType);
    }
    @GetMapping("/web-server-types")
    public ResponseEntity<List<WebServerType>> getAllWebServerType(){
        List<WebServerType> allWebServerType = webServerTypeService.getAllWebServerType();
        return ResponseEntity.ok(allWebServerType);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/ostypes")
    public ResponseEntity<OSType> createOSType(@RequestBody OSType osType) {
        OSType saved = osTypeService.createOSType(osType);
        return ResponseEntity.ok(saved);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/web-server-types")
    public ResponseEntity<WebServerType> createWebServerType(@RequestBody WebServerType webServerType){
        WebServerType saved = webServerTypeService.createWebServerType(webServerType);
        return ResponseEntity.ok(saved);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/ostypes/{id}")
    public ResponseEntity<OSType> updateOSType(@PathVariable Long id , @RequestBody OSType osType){
       OSType updated = osTypeService.updateOSType(id,osType);
       return ResponseEntity.ok(updated);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/webtypes/{id}")
    public ResponseEntity<WebServerType> updateWebServerType(@PathVariable Long id,@RequestBody WebServerType webServerType){
        WebServerType updated = webServerTypeService.updateWebServerType(id,webServerType);
        return ResponseEntity.ok(updated);
    }


}
