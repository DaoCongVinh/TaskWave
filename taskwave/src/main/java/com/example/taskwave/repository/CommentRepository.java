package com.example.taskwave.repository;

import com.example.taskwave.entity.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends MongoRepository<Comment, String> {

    List<Comment> findByTaskIdOrderByCreatedAtDesc(String taskId);

    void deleteByTaskId(String taskId);
}
