package com.wsms.service;

import com.wsms.entity.OSType;
import com.wsms.repository.OSTypeRepo;
import com.wsms.service.interfaces.OSTypeServiceInterface;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OSTypeService implements OSTypeServiceInterface {

    private final OSTypeRepo osTypeRepo;
    public OSType createOSType(OSType osType) {
        return  osTypeRepo.save(osType);
    }

    public List<OSType> getAllOSType() {
        return osTypeRepo.findAll();
    }

    public OSType updateOSType(Long id,OSType osType) {
        OSType osType1=osTypeRepo.findById(id).orElseThrow(() -> new RuntimeException("OS not found"));
        osType1.setActive(osType.isActive());
        return  osTypeRepo.save(osType1);
    }
}
