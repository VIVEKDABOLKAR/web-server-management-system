package com.wsms.service.interfaces;

import com.wsms.dto.auth.AuthResponse;
import com.wsms.dto.auth.LoginRequest;
import com.wsms.dto.auth.SignupRequest;

public interface AuthServiceInterface {

    AuthResponse signup(SignupRequest request);

    AuthResponse login(LoginRequest request);
}
