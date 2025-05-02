package com.example.TempService.service;

import com.example.TempService.dto.EmailRequestDto;
import com.example.TempService.dto.EmailResponseDto;
import com.example.TempService.entity.EmailTemplate;
import com.example.TempService.repo.EmailTemplateRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private EmailTemplateRepository templateRepository;

    @Value("${spring.mail.username}")
    private String senderEmail;

    @Autowired
    private String senderName;

    public EmailResponseDto sendEmail(Long templateId, EmailRequestDto emailRequestDto) {
        try {
            EmailTemplate template = templateRepository.findById(templateId)
                    .orElseThrow(() -> new RuntimeException("Template not found with id: " + templateId));

            // Get subject and content (using either from template or request)
            String subject = emailRequestDto.getSubject() != null && !emailRequestDto.getSubject().isEmpty()
                    ? emailRequestDto.getSubject() : template.getSubject();

            String content = emailRequestDto.getContent() != null && !emailRequestDto.getContent().isEmpty()
                    ? emailRequestDto.getContent() : template.getContent();

            List<String> recipients = emailRequestDto.getRecipients();

            if (recipients == null || recipients.isEmpty()) {
                throw new RuntimeException("No recipients provided");
            }

            // Send email to each recipient individually (better for deliverability)
            for (String recipient : recipients) {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

                // Set proper FROM header with name
                helper.setFrom(new InternetAddress(senderEmail, senderName));

                // Set TO (individual recipient)
                helper.setTo(recipient);

                // Set subject with template name prefix to make it recognizable
                helper.setSubject(subject);

                // Add message ID and List-Unsubscribe headers
                String messageId = "<" + UUID.randomUUID().toString() + "@yourdomain.com>";
                message.setHeader("Message-ID", messageId);
                message.setHeader("List-Unsubscribe", "<mailto:" + senderEmail + "?subject=unsubscribe>");
                message.setHeader("X-Mailer", "Your Application Name");

                // Add footer with unsubscribe link to HTML content
                String unsubscribeFooter = "<br><br><hr style='border:none;height:1px;background-color:#e0e0e0'>" +
                        "<p style='font-size:12px;color:#666'>You received this email because you are registered with " +
                        senderName + ". If you don't want to receive these emails, " +
                        "<a href='mailto:" + senderEmail + "?subject=Unsubscribe'>click here to unsubscribe</a>.</p>";

                // Add the content with unsubscribe footer
                helper.setText(content + unsubscribeFooter, true);

                // Send the message
                mailSender.send(message);
            }

            EmailResponseDto response = new EmailResponseDto();
            response.setSuccess(true);
            response.setMessage("Email sent successfully to " + recipients.size() + " recipients");
            return response;

        } catch (Exception e) {
            EmailResponseDto response = new EmailResponseDto();
            response.setSuccess(false);
            response.setMessage("Error sending email: " + e.getMessage());
            return response;
        }
    }
}