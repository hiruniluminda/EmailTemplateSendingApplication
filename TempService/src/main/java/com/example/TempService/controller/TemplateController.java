package com.example.TempService.controller;

import com.example.TempService.dto.TemplateDtos.MessageResponse;
import com.example.TempService.dto.TemplateDtos.TemplateRequest;
import com.example.TempService.dto.TemplateDtos.TemplateResponse;
import com.example.TempService.service.TemplateService;
import com.example.TempService.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/templates")
public class TemplateController {

    @Autowired
    private TemplateService templateService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<List<TemplateResponse>> getAllTemplates(HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        List<TemplateResponse> templates = templateService.getAllTemplatesByUserId(userId);
        return ResponseEntity.ok(templates);
    }

    @GetMapping("/debug-token")
    public ResponseEntity<String> debugToken(HttpServletRequest request) {
        String token = jwtUtil.getJwtFromRequest(request);
        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No token provided");
        }

        try {
            // Try to validate and decode the token
            Long userId = jwtUtil.getUserIdFromJWT(token);
            return ResponseEntity.ok("Token valid! User ID: " + userId);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token invalid: " + e.getMessage());
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<TemplateResponse>> searchTemplates(
            @RequestParam String name,
            HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        List<TemplateResponse> templates = templateService.searchTemplatesByName(userId, name);
        return ResponseEntity.ok(templates);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TemplateResponse> getTemplateById(@PathVariable Long id) {
        TemplateResponse template = templateService.getTemplateById(id);
        return ResponseEntity.ok(template);
    }

    @PostMapping
    public ResponseEntity<TemplateResponse> createTemplate(
            @RequestBody TemplateRequest templateRequest,
            HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        TemplateResponse createdTemplate = templateService.createTemplate(userId, templateRequest);
        return ResponseEntity.ok(createdTemplate);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TemplateResponse> updateTemplate(
            @PathVariable Long id,
            @RequestBody TemplateRequest templateRequest,
            HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        TemplateResponse updatedTemplate = templateService.updateTemplate(id, templateRequest, userId);
        return ResponseEntity.ok(updatedTemplate);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteTemplate(
            @PathVariable Long id,
            HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        templateService.deleteTemplate(id, userId);
        return ResponseEntity.ok(new MessageResponse("Template deleted successfully"));
    }

    private Long getUserIdFromRequest(HttpServletRequest request) {
        String jwt = jwtUtil.getJwtFromRequest(request);
        return jwtUtil.getUserIdFromJWT(jwt);
    }
}