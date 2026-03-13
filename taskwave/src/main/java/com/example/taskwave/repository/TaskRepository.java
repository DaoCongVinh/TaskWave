package com.example.taskwave.repository;

import com.example.taskwave.entity.Task;
import com.example.taskwave.entity.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends MongoRepository<Task, String> {

    Page<Task> findByProjectId(String projectId, Pageable pageable);

    List<Task> findByAssigneeId(String assigneeId);

    Page<Task> findByProjectIdAndStatus(String projectId, TaskStatus status, Pageable pageable);

    Page<Task> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
            String title, String description, Pageable pageable);

    void deleteByProjectId(String projectId);
}
