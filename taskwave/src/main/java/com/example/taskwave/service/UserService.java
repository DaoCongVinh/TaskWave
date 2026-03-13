package com.example.taskwave.service;

import com.example.taskwave.dto.UpdateUserRequest;
import com.example.taskwave.dto.UserDto;

public interface UserService{
    UserDto getUserProfile(String username);
    UserDto updateProfile(String username, UpdateUserRequest request);
}
