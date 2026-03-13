package com.example.taskwave.service;

import com.example.taskwave.dto.ProjectDto;

import java.util.List;

public interface ProjectService {
    ProjectDto createProject(ProjectDto projectDto, String username);

    ProjectDto updateProject(String id, ProjectDto projectDto, String username);

    void deleteProject(String id, String username);

    List<ProjectDto> getProjectsForUser(String username);

    ProjectDto getProjectById(String id);

    ProjectDto addMember(String projectId, String memberUsername, String ownerUsername);
}
