package com.example.taskwave.controller;

import com.example.taskwave.dto.ApiResponse;
import com.example.taskwave.dto.ProjectDto;
import com.example.taskwave.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProjectDto>>> getProjects(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<ProjectDto> projects = projectService.getProjectsForUser(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(projects));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProjectDto>> createProject(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ProjectDto projectDto) {
        ProjectDto created = projectService.createProject(projectDto, userDetails.getUsername());
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Project created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectDto>> updateProject(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ProjectDto projectDto) {
        ProjectDto updated = projectService.updateProject(id, projectDto, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Project updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProject(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        projectService.deleteProject(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Project deleted successfully", null));
    }

    @PostMapping("/{id}/members")
    public ResponseEntity<ApiResponse<ProjectDto>> addMember(
            @PathVariable String id,
            @RequestParam String username,
            @AuthenticationPrincipal UserDetails userDetails) {
        ProjectDto updated = projectService.addMember(id, username, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Member added successfully", updated));
    }
}
