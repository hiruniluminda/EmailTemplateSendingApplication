package com.example.TempService.service;

import com.example.TempService.dto.TemplateDtos.TemplateRequest;
import com.example.TempService.dto.TemplateDtos.TemplateResponse;
import com.example.TempService.entity.EmailTemplate;
import com.example.TempService.repo.EmailTemplateRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TemplateService {

    private static final Logger logger = LoggerFactory.getLogger(TemplateService.class);

    @Autowired
    private EmailTemplateRepository templateRepository;

    public List<TemplateResponse> getAllTemplatesByUserId(Long userId) {
        return templateRepository.findByUserId(userId).stream()
                .map(this::mapToTemplateResponse)
                .collect(Collectors.toList());
    }

    public List<TemplateResponse> searchTemplatesByName(Long userId, String name) {
        return templateRepository.findByUserIdAndNameContaining(userId, name).stream()
                .map(this::mapToTemplateResponse)
                .collect(Collectors.toList());
    }

    public TemplateResponse getTemplateById(Long id) {
        EmailTemplate template = templateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Template not found with id: " + id));

        return mapToTemplateResponse(template);
    }

    public TemplateResponse createTemplate(Long userId, TemplateRequest request) {
        EmailTemplate template = EmailTemplate.builder()
                .name(request.getName())
                .subject(request.getSubject())
                .content(request.getContent())
                .userId(userId)
                .createdAt(LocalDateTime.now())
                .build();

        EmailTemplate savedTemplate = templateRepository.save(template);
        return mapToTemplateResponse(savedTemplate);
    }

    public TemplateResponse updateTemplate(Long id, TemplateRequest request, Long userId) {
        EmailTemplate template = templateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Template not found with id: " + id));

        if (!template.getUserId().equals(userId)) {
            throw new RuntimeException("You don't have permission to update this template");
        }

        template.setName(request.getName());
        template.setSubject(request.getSubject());
        template.setContent(request.getContent());

        EmailTemplate updatedTemplate = templateRepository.save(template);
        return mapToTemplateResponse(updatedTemplate);
    }

    public void deleteTemplate(Long id, Long userId) {
        EmailTemplate template = templateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Template not found with id: " + id));

        if (!template.getUserId().equals(userId)) {
            throw new RuntimeException("You don't have permission to delete this template");
        }

        templateRepository.delete(template);
    }

    private TemplateResponse mapToTemplateResponse(EmailTemplate template) {
        return TemplateResponse.builder()
                .id(template.getId())
                .name(template.getName())
                .subject(template.getSubject())
                .content(template.getContent())
                .userId(template.getUserId())
                .createdAt(template.getCreatedAt())
                .updatedAt(template.getUpdatedAt())
                .build();
    }
}