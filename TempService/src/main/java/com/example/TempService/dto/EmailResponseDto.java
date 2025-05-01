package com.example.TempService.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmailResponseDto {
    private String message;
    private boolean success;
    private int sentCount;

    // Constructor with just message and success
    public EmailResponseDto(String message, boolean success) {
        this.message = message;
        this.success = success;
        this.sentCount = 0;
    }
}