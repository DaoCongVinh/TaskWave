package com.example.taskwave.service;

import com.example.taskwave.dto.AuthResponse;
import com.example.taskwave.dto.LoginRequest;
import com.example.taskwave.dto.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest registerRequest);
    AuthResponse login(LoginRequest loginRequest);
}
