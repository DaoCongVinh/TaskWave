package com.example.taskwave.service.impl;

import com.example.taskwave.dto.ProjectDto;
import com.example.taskwave.entity.Project;
import com.example.taskwave.entity.User;
import com.example.taskwave.exception.BadRequestException;
import com.example.taskwave.exception.ResourceNotFoundException;
import com.example.taskwave.mapper.EntityMapper;
import com.example.taskwave.repository.ProjectRepository;
import com.example.taskwave.repository.UserRepository;
import com.example.taskwave.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final EntityMapper entityMapper;

    @Override
    public ProjectDto createProject(ProjectDto projectDto, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Project project = entityMapper.toProject(projectDto);
        project.setOwnerId(user.getId());
        if (project.getMemberIds() == null) {
            project.setMemberIds(new ArrayList<>());
        }

        Project savedProject = projectRepository.save(project);
        return entityMapper.toProjectDto(savedProject);
    }

    @Override
    public ProjectDto updateProject(String id, ProjectDto projectDto, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        if (!project.getOwnerId().equals(user.getId())) {
            throw new BadRequestException("You are not the owner of this project");
        }

        project.setName(projectDto.getName());
        project.setDescription(projectDto.getDescription());

        Project updatedProject = projectRepository.save(project);
        return entityMapper.toProjectDto(updatedProject);
    }

    @Override
    public void deleteProject(String id, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        if (!project.getOwnerId().equals(user.getId())) {
            throw new BadRequestException("You are not the owner of this project");
        }

        projectRepository.delete(project);
    }

    @Override
    public List<ProjectDto> getProjectsForUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Project> projects = projectRepository.findByOwnerIdOrMemberIdsContaining(user.getId(), user.getId());

        return projects.stream()
                .map(entityMapper::toProjectDto)
                .collect(Collectors.toList());
    }

    @Override
    public ProjectDto getProjectById(String id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        return entityMapper.toProjectDto(project);
    }

    @Override
    public ProjectDto addMember(String projectId, String memberUsername, String ownerUsername) {
        User owner = userRepository.findByUsername(ownerUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found"));

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        if (!project.getOwnerId().equals(owner.getId())) {
            throw new BadRequestException("You are not the owner of this project");
        }

        User member = userRepository.findByUsername(memberUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found"));

        if (project.getOwnerId().equals(member.getId())) {
            throw new BadRequestException("User is already the owner");
        }

        if (project.getMemberIds().contains(member.getId())) {
            throw new BadRequestException("User is already a member");
        }

        project.getMemberIds().add(member.getId());
        Project updatedProject = projectRepository.save(project);

        return entityMapper.toProjectDto(updatedProject);
    }
}
