package com.example.taskwave.controller;

import com.example.taskwave.dto.ApiResponse;
import com.example.taskwave.dto.TaskDto;
import com.example.taskwave.entity.TaskStatus;
import com.example.taskwave.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<ApiResponse<TaskDto>> createTask(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody TaskDto taskDto) {
        TaskDto created = taskService.createTask(taskDto, userDetails.getUsername());
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Task created successfully", created));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskDto>> getTask(@PathVariable String id) {
        TaskDto task = taskService.getTaskById(id);
        return ResponseEntity.ok(ApiResponse.success(task));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskDto>> updateTask(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody TaskDto taskDto) {
        TaskDto updated = taskService.updateTask(id, taskDto, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Task updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        taskService.deleteTask(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Task deleted successfully", null));
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<Page<TaskDto>>> getAllTasks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "100") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        Sort sort = direction.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<TaskDto> tasks = taskService.getAllTasks(pageable);
        return ResponseEntity.ok(ApiResponse.success(tasks));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<TaskDto>>> getTasksByProject(
            @RequestParam String projectId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        Sort sort = direction.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<TaskDto> tasks = taskService.getTasksByProject(projectId, pageable);
        return ResponseEntity.ok(ApiResponse.success(tasks));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<TaskDto>>> searchTasks(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<TaskDto> tasks = taskService.searchTasks(query, pageable);
        return ResponseEntity.ok(ApiResponse.success(tasks));
    }

    @PatchMapping("/{id}/assign")
    public ResponseEntity<ApiResponse<TaskDto>> assignTask(
            @PathVariable String id,
            @RequestParam String assigneeUsername,
            @AuthenticationPrincipal UserDetails userDetails) {
        TaskDto updated = taskService.assignTask(id, assigneeUsername, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Task assigned successfully", updated));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<TaskDto>> changeStatus(
            @PathVariable String id,
            @RequestParam TaskStatus status,
            @AuthenticationPrincipal UserDetails userDetails) {
        TaskDto updated = taskService.changeStatus(id, status, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Task status updated successfully", updated));
    }
}
