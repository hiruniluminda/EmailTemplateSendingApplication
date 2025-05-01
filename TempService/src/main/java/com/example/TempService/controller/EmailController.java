package com.example.TempService.controller;

import com.example.TempService.dto.EmailRequestDto;
import com.example.TempService.dto.EmailResponseDto;
import com.example.TempService.service.EmailService;
import com.example.TempService.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/emails")
public class EmailController {

    @Autowired
    private EmailService emailService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/send/{templateId}")
    public ResponseEntity<EmailResponseDto> sendEmail(
            @PathVariable Long templateId,
            @RequestBody EmailRequestDto emailRequestDto,
            HttpServletRequest request) {
        try {
            // Log the incoming request for debugging
            System.out.println("Received email send request for template ID: " + templateId);
            System.out.println("Request body: " + emailRequestDto);

            // Verify authorization (optional if you want to ensure the user has permission)
            String jwt = jwtUtil.getJwtFromRequest(request);
            if (jwt != null) {
                Long userId = jwtUtil.getUserIdFromJWT(jwt);
                System.out.println("Request from user ID: " + userId);
            }

            EmailResponseDto response = emailService.sendEmail(templateId, emailRequestDto);
            return new ResponseEntity<>(response, response.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            System.err.println("Error sending email: " + e.getMessage());
            e.printStackTrace();

            EmailResponseDto errorResponse = new EmailResponseDto();
            errorResponse.setSuccess(false);
            errorResponse.setMessage("Error sending email: " + e.getMessage());

            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}