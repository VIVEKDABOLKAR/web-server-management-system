package com.wsms.service.interfaces;

public interface S3ServiceInterface {

    String uploadFile(String fileName, byte[] fileContent);
}
