package com.wsms.service.interfaces;

import java.util.Map;

public interface PasswordResetServiceInterface {

    Map<String, String> requestPasswordReset(String email);

    Map<String, String> verifyOtp(String email, String otp);

    Map<String, String> resetPassword(String email, String otp, String newPassword);
}
