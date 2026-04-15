package com.wsms.service.interfaces;

import com.wsms.entity.User;

import java.util.Map;

public interface SignupVerificationServiceInterface {

    Map<String, String> sendVerificationCode(User user);

    Map<String, String> verifyOtp(String email, String otp);
}
