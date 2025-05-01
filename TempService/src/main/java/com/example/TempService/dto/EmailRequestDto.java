package com.example.TempService.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmailRequestDto {
    private List<String> recipients;
    private String subject;
    private String content;
    private String from; // Optional: sender email address
}