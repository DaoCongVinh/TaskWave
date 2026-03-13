package com.example.taskwave.service;

import com.example.taskwave.dto.CommentDto;

import java.util.List;

public interface CommentService {

    CommentDto addComment(CommentDto commentDto, String username);

    List<CommentDto> getCommentsByTask(String taskId);

    void deleteComment(String commentId, String username);
}
