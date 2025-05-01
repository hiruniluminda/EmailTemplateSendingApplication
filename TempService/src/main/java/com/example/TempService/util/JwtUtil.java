package com.example.TempService.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.annotation.PostConstruct;
import java.security.Key;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String jwtSecret;

    private Key signingKey;

    @PostConstruct
    public void init() {
        // Initialize the signing key once when the bean is created
        byte[] keyBytes = jwtSecret.getBytes();
        signingKey = Keys.hmacShaKeyFor(keyBytes);
    }

    private Key getSigningKey() {
        return signingKey;
    }

    public String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    public Long getUserIdFromJWT(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            return Long.parseLong(claims.getSubject());
        } catch (Exception ex) {
            System.err.println("Error parsing JWT token: " + ex.getMessage());
            throw ex;
        }
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(authToken);
            return true;
        } catch (Exception ex) {
            System.err.println("Token validation failed: " + ex.getClass().getName() + " - " + ex.getMessage());
            return false;
        }
    }
}