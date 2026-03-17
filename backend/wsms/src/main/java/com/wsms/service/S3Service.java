package com.wsms.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Service
@RequiredArgsConstructor
public class S3Service {

    private final S3Client s3Client;

    @Value("${aws.s3.bucket}")
    private String s3BucketName;

    @Value("${aws.region}")
    private String awsRegion;

    public String uploadFile(String fileName, byte[] fileContent) {
        try {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(s3BucketName)
                    .key(fileName)
                    .contentType("text/x-shellscript") // for .sh files
                    .build();

            s3Client.putObject(
                    putObjectRequest,
                    RequestBody.fromBytes(fileContent)
            );

            // Construct file URL (public bucket or accessible URL)
            return String.format(
                    "https://%s.s3.%s.amazonaws.com/%s",
                    s3BucketName,
                    awsRegion,
                    fileName
            );

        } catch (Exception e) {
            throw new RuntimeException("Failed to upload file to S3", e);
        }
    }

}
