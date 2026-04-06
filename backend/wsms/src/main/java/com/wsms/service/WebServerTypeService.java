package com.wsms.service;

import com.wsms.entity.WebServerType;
import com.wsms.repository.WebServerTypeRepo;
import com.wsms.service.interfaces.WebServerTypeServiceInterface;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WebServerTypeService implements WebServerTypeServiceInterface {
    private final WebServerTypeRepo webServerTypeRepo;

    public WebServerType createWebServerType(WebServerType webServerType){
        return webServerTypeRepo.save(webServerType);
    }

    public List<WebServerType> getAllWebServerType() {
        return webServerTypeRepo.findAll();
    }

    public WebServerType updateWebServerType(Long id, WebServerType webServerType) {
        WebServerType webServerType1 = webServerTypeRepo.findById(id).
                orElseThrow(() -> new RuntimeException("WebServerType is not found"));
        webServerType1.setActive(webServerType.isActive());
        webServerTypeRepo.save(webServerType1);
        return webServerType1;
    }
}
