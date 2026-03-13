package com.example.taskwave.controller;

import com.example.taskwave.dto.ApiResponse;
import com.example.taskwave.dto.CommentDto;
import com.example.taskwave.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    public ResponseEntity<ApiResponse<CommentDto>> addComment(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CommentDto commentDto) {
        CommentDto created = commentService.addComment(commentDto, userDetails.getUsername());
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Comment added successfully", created));
    }

    @GetMapping("/task/{taskId}")
    public ResponseEntity<ApiResponse<List<CommentDto>>> getCommentsByTask(
            @PathVariable String taskId) {
        List<CommentDto> comments = commentService.getCommentsByTask(taskId);
        return ResponseEntity.ok(ApiResponse.success(comments));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteComment(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        commentService.deleteComment(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Comment deleted successfully", null));
    }
}
