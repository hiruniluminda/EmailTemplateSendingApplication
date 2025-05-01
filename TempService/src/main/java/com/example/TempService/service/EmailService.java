package com.example.TempService.service;

import com.example.TempService.dto.EmailRequestDto;
import com.example.TempService.dto.EmailResponseDto;
import com.example.TempService.dto.TemplateDtos.TemplateResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender javaMailSender;

    @Autowired
    private TemplateService templateService;

    @Value("${spring.mail.username:}")
    private String defaultFromAddress;

    public EmailResponseDto sendEmail(Long templateId, EmailRequestDto emailRequestDto) {
        TemplateResponse template = templateService.getTemplateById(templateId);
        logger.info("Starting to send emails using template: {}", template.getName());

        int sentCount = 0;

        try {
            // If subject is not provided in the request, use the template subject
            String subject = emailRequestDto.getSubject();
            if (subject == null || subject.isEmpty()) {
                subject = template.getSubject();
            }

            // If content is not provided in the request, use the template content
            String content = emailRequestDto.getContent();
            if (content == null || content.isEmpty()) {
                content = template.getContent();
            }

            // Determine the sender address
            String fromAddress = emailRequestDto.getFrom();
            if (fromAddress == null || fromAddress.isEmpty()) {
                fromAddress = defaultFromAddress;
            }

            for (String recipient : emailRequestDto.getRecipients()) {
                logger.info("Sending email to recipient: {}", recipient);

                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(recipient);
                message.setSubject(subject);
                message.setText(content);

                // Set FROM address explicitly
                message.setFrom(fromAddress);

                try {
                    javaMailSender.send(message);
                    logger.info("Successfully sent email to: {}", recipient);
                    sentCount++;
                } catch (Exception e) {
                    logger.error("Failed to send email to: {}, Error: {}", recipient, e.getMessage());
                }
            }

            if (sentCount > 0) {
                logger.info("Email sending process completed. Sent {} emails successfully", sentCount);
                return new EmailResponseDto(
                        "Emails sent successfully",
                        true,
                        sentCount
                );
            } else {
                logger.warn("No emails were sent successfully");
                return new EmailResponseDto(
                        "Failed to send any emails",
                        false,
                        sentCount
                );
            }
        } catch (Exception e) {
            logger.error("Error in email sending process: {}", e.getMessage());
            return new EmailResponseDto(
                    "Failed to send emails: " + e.getMessage(),
                    false,
                    sentCount
            );
        }
    }
}