package com.example.taskwave.service;

import com.example.taskwave.dto.TaskDto;
import com.example.taskwave.entity.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TaskService {

    TaskDto createTask(TaskDto taskDto, String username);

    TaskDto updateTask(String id, TaskDto taskDto, String username);

    void deleteTask(String id, String username);

    TaskDto getTaskById(String id);

    Page<TaskDto> getAllTasks(Pageable pageable);

    Page<TaskDto> getTasksByProject(String projectId, Pageable pageable);

    Page<TaskDto> searchTasks(String query, Pageable pageable);

    TaskDto assignTask(String taskId, String assigneeUsername, String username);

    TaskDto changeStatus(String taskId, TaskStatus status, String username);
}