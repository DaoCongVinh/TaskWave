package com.example.taskwave.service.impl;

import com.example.taskwave.dto.UpdateUserRequest;
import com.example.taskwave.dto.UserDto;
import com.example.taskwave.entity.User;
import com.example.taskwave.exception.BadRequestException;
import com.example.taskwave.exception.ResourceNotFoundException;
import com.example.taskwave.mapper.EntityMapper;
import com.example.taskwave.repository.UserRepository;
import com.example.taskwave.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final EntityMapper entityMapper;

    @Override
    public UserDto getUserProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
        return entityMapper.toUserDto(user);
    }

    @Override
    public UserDto updateProfile(String username, UpdateUserRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        if (request.getUsername() != null && !request.getUsername().equals(user.getUsername())) {
            if (userRepository.existsByUsername(request.getUsername())) {
                throw new BadRequestException("Username is already taken");
            }
            user.setUsername(request.getUsername());
        }

        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new BadRequestException("Email is already in use");
            }
            user.setEmail(request.getEmail());
        }

        User updatedUser = userRepository.save(user);
        log.info("User profile updated: {}", updatedUser.getUsername());
        return entityMapper.toUserDto(updatedUser);
    }
}
