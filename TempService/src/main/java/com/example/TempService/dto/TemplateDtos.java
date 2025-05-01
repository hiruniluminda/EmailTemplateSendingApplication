package com.example.TempService.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class TemplateDtos {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TemplateRequest {
        private String name;
        private String subject;
        private String content;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TemplateResponse {
        private Long id;
        private String name;
        private String subject;
        private String content;
        private Long userId;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MessageResponse {
        private String message;
    }
}