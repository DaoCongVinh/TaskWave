package com.example.taskwave.dto;

import com.example.taskwave.entity.TaskPriority;
import com.example.taskwave.entity.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskDto {
    private String id;

    @NotBlank(message = "Task title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;

    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    private String description;

    private TaskStatus status;
    private TaskPriority priority;
    private LocalDateTime deadline;
    private String assigneeId;
    private String assigneeUsername;
    private String projectId;
    private String projectName;
    private LocalDateTime createdAt;
}
