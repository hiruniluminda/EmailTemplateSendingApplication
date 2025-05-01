package com.example.TempService.repo;

import com.example.TempService.entity.EmailTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmailTemplateRepository extends JpaRepository<EmailTemplate, Long> {
    List<EmailTemplate> findByUserId(Long userId);
    List<EmailTemplate> findByUserIdAndNameContaining(Long userId, String name);
}