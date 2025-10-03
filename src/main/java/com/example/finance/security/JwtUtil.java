package com.example.finance.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

import java.nio.charset.StandardCharsets; 
import java.security.Key;
import java.util.Date;
import java.util.Base64; 

import org.springframework.beans.factory.annotation.Value; 
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {

    private final Key key; 

    private final long expiration = 24 * 60 * 60 * 1000;

    public JwtUtil(@Value("${jwt.secret}") String secret) {

        try {
            byte[] keyBytes = Base64.getDecoder().decode(secret.getBytes(StandardCharsets.UTF_8));
            this.key = Keys.hmacShaKeyFor(keyBytes);
            System.out.println("[JWT Util] Key successfully initialized from persistent Base64 secret.");
        } catch (IllegalArgumentException e) {
            System.err.println("[JWT Util ERROR] Secret key must be a valid Base64 encoded string. Check .env.production.");
            throw new RuntimeException("Invalid JWT secret configuration.", e);
        }
    }

    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(key, SignatureAlgorithm.HS512) 
                .compact();
    }

    public String getUsernameFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            System.err.println("[JWT Validation Error] Token rejected: " + e.getMessage());
            return false;
        }
    }
}
