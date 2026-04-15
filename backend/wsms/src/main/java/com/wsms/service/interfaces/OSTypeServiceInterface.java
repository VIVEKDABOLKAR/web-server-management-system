package com.wsms.service.interfaces;

import com.wsms.entity.OSType;

import java.util.List;

public interface OSTypeServiceInterface {

    OSType createOSType(OSType osType);

    List<OSType> getAllOSType();

    OSType updateOSType(Long id, OSType osType);
}
