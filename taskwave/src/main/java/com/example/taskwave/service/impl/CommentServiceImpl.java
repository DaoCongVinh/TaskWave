package com.example.taskwave.service.impl;

import com.example.taskwave.dto.CommentDto;
import com.example.taskwave.entity.Comment;
import com.example.taskwave.entity.User;
import com.example.taskwave.exception.AccessDeniedException;
import com.example.taskwave.exception.ResourceNotFoundException;
import com.example.taskwave.mapper.EntityMapper;
import com.example.taskwave.repository.CommentRepository;
import com.example.taskwave.repository.TaskRepository;
import com.example.taskwave.repository.UserRepository;
import com.example.taskwave.service.CommentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

        private final CommentRepository commentRepository;
        private final TaskRepository taskRepository;
        private final UserRepository userRepository;
        private final EntityMapper entityMapper;

        @Override
        public CommentDto addComment(CommentDto commentDto, String username) {
                // Validate task exists
                taskRepository.findById(commentDto.getTaskId())
                                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", commentDto.getTaskId()));

                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

                Comment comment = Comment.builder()
                                .content(commentDto.getContent())
                                .taskId(commentDto.getTaskId())
                                .userId(user.getId())
                                .build();

                Comment saved = commentRepository.save(comment);
                log.info("Comment added to task {} by {}", commentDto.getTaskId(), username);
                return enrichCommentDto(saved);
        }

        @Override
        public List<CommentDto> getCommentsByTask(String taskId) {
                // Validate task exists
                taskRepository.findById(taskId)
                                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskId));

                return commentRepository.findByTaskIdOrderByCreatedAtDesc(taskId).stream()
                                .map(this::enrichCommentDto)
                                .collect(Collectors.toList());
        }

        @Override
        public void deleteComment(String commentId, String username) {
                Comment comment = commentRepository.findById(commentId)
                                .orElseThrow(() -> new ResourceNotFoundException("Comment", "id", commentId));

                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

                if (!comment.getUserId().equals(user.getId())) {
                        throw new AccessDeniedException("You can only delete your own comments");
                }

                commentRepository.delete(comment);
                log.info("Comment {} deleted by {}", commentId, username);
        }

        /**
         * Enrich a CommentDto with the commenter's username.
         */
        private CommentDto enrichCommentDto(Comment comment) {
                CommentDto dto = entityMapper.toCommentDto(comment);
                userRepository.findById(comment.getUserId())
                                .ifPresent(user -> dto.setUsername(user.getUsername()));
                return dto;
        }
}
