package com.example.taskwave.repository;

import com.example.taskwave.entity.Project;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends MongoRepository<Project, String> {

    List<Project> findByOwnerId(String ownerId);

    List<Project> findByMemberIdsContaining(String userId);

    List<Project> findByOwnerIdOrMemberIdsContaining(String ownerId, String userId);
}