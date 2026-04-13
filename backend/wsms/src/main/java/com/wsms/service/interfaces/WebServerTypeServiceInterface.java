package com.wsms.service.interfaces;

import com.wsms.entity.WebServerType;

import java.util.List;

public interface WebServerTypeServiceInterface {

    WebServerType createWebServerType(WebServerType webServerType);

    List<WebServerType> getAllWebServerType();

    WebServerType updateWebServerType(Long id, WebServerType webServerType);
}
