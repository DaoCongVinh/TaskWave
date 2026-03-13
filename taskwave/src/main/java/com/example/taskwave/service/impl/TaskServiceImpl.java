package com.example.taskwave.service.impl;

import com.example.taskwave.dto.TaskDto;
import com.example.taskwave.entity.Project;
import com.example.taskwave.entity.Task;
import com.example.taskwave.entity.TaskPriority;
import com.example.taskwave.entity.TaskStatus;
import com.example.taskwave.entity.User;
import com.example.taskwave.exception.ResourceNotFoundException;
import com.example.taskwave.mapper.EntityMapper;
import com.example.taskwave.repository.ProjectRepository;
import com.example.taskwave.repository.TaskRepository;
import com.example.taskwave.repository.UserRepository;
import com.example.taskwave.service.TaskService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final EntityMapper entityMapper;

    @Override
    public TaskDto createTask(TaskDto taskDto, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        // Validate project exists
        Project project = projectRepository.findById(taskDto.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", taskDto.getProjectId()));

        Task task = Task.builder()
                .title(taskDto.getTitle())
                .description(taskDto.getDescription())
                .status(taskDto.getStatus() != null ? taskDto.getStatus() : TaskStatus.TODO)
                .priority(taskDto.getPriority() != null ? taskDto.getPriority()
                        : TaskPriority.MEDIUM)
                .deadline(taskDto.getDeadline())
                .assigneeId(taskDto.getAssigneeId())
                .projectId(project.getId())
                .build();

        Task saved = taskRepository.save(task);
        log.info("Task created: {} in project {}", saved.getTitle(), project.getName());
        return enrichTaskDto(saved);
    }

    @Override
    public TaskDto updateTask(String id, TaskDto taskDto, String username) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));

        if (taskDto.getTitle() != null)
            task.setTitle(taskDto.getTitle());
        if (taskDto.getDescription() != null)
            task.setDescription(taskDto.getDescription());
        if (taskDto.getStatus() != null)
            task.setStatus(taskDto.getStatus());
        if (taskDto.getPriority() != null)
            task.setPriority(taskDto.getPriority());
        if (taskDto.getDeadline() != null)
            task.setDeadline(taskDto.getDeadline());
        if (taskDto.getAssigneeId() != null)
            task.setAssigneeId(taskDto.getAssigneeId());

        Task updated = taskRepository.save(task);
        log.info("Task updated: {}", updated.getTitle());
        return enrichTaskDto(updated);
    }

    @Override
    public void deleteTask(String id, String username) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));

        taskRepository.delete(task);
        log.info("Task deleted: {}", task.getTitle());
    }

    @Override
    public TaskDto getTaskById(String id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));
        return enrichTaskDto(task);
    }

    @Override
    public Page<TaskDto> getAllTasks(Pageable pageable) {
        return taskRepository.findAll(pageable)
                .map(this::enrichTaskDto);
    }

    @Override
    public Page<TaskDto> getTasksByProject(String projectId, Pageable pageable) {
        // Validate project exists
        projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));

        return taskRepository.findByProjectId(projectId, pageable)
                .map(this::enrichTaskDto);
    }

    @Override
    public Page<TaskDto> searchTasks(String query, Pageable pageable) {
        return taskRepository
                .findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query, query, pageable)
                .map(this::enrichTaskDto);
    }

    @Override
    public TaskDto assignTask(String taskId, String assigneeUsername, String username) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskId));

        User assignee = userRepository.findByUsername(assigneeUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", assigneeUsername));

        task.setAssigneeId(assignee.getId());
        Task updated = taskRepository.save(task);
        log.info("Task {} assigned to {}", task.getTitle(), assigneeUsername);
        return enrichTaskDto(updated);
    }

    @Override
    public TaskDto changeStatus(String taskId, TaskStatus status, String username) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskId));

        task.setStatus(status);
        Task updated = taskRepository.save(task);
        log.info("Task {} status changed to {}", task.getTitle(), status);
        return enrichTaskDto(updated);
    }

    /**
     * Enrich a TaskDto with assignee username and project name.
     */
    private TaskDto enrichTaskDto(Task task) {
        TaskDto dto = entityMapper.toTaskDto(task);

        if (task.getAssigneeId() != null) {
            userRepository.findById(task.getAssigneeId())
                    .ifPresent(user -> dto.setAssigneeUsername(user.getUsername()));
        }

        if (task.getProjectId() != null) {
            projectRepository.findById(task.getProjectId())
                    .ifPresent(project -> dto.setProjectName(project.getName()));
        }

        return dto;
    }
}
