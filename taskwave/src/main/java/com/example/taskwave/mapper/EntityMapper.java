package com.example.taskwave.mapper;

import com.example.taskwave.dto.CommentDto;
import com.example.taskwave.dto.ProjectDto;
import com.example.taskwave.dto.RegisterRequest;
import com.example.taskwave.dto.TaskDto;
import com.example.taskwave.dto.UserDto;
import com.example.taskwave.entity.Comment;
import com.example.taskwave.entity.Project;
import com.example.taskwave.entity.Task;
import com.example.taskwave.entity.User;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class EntityMapper {

    private final ModelMapper modelMapper;

    public EntityMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    // User mapping

    public UserDto toUserDto(User user) {
        return modelMapper.map(user, UserDto.class);
    }

    public User toUser(RegisterRequest request) {
        return modelMapper.map(request, User.class);
    }

    // Project mappings

    public ProjectDto toProjectDto(Project project) {
        return modelMapper.map(project, ProjectDto.class);
    }

    public Project toProject(ProjectDto dto) {
        return modelMapper.map(dto, Project.class);
    }

    // Task mappings

    public TaskDto toTaskDto(Task task) {
        return modelMapper.map(task, TaskDto.class);
    }

    public Task toTask(TaskDto dto) {
        return modelMapper.map(dto, Task.class);
    }

    // Comment mappings

    public CommentDto toCommentDto(Comment comment) {
        return modelMapper.map(comment, CommentDto.class);
    }

    public Comment toComment(CommentDto dto) {
        return modelMapper.map(dto, Comment.class);
    }
}
