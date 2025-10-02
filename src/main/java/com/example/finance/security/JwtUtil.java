package com.example.finance.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

import java.nio.charset.StandardCharsets; // REQUIRED IMPORT for decoding the secret
import java.security.Key;
import java.util.Date;
import java.util.Base64; // NEW: Import for Base64 decoding

import org.springframework.beans.factory.annotation.Value; // REQUIRED IMPORT for @Value
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {

    // CRITICAL FIX: The key is now read from configuration, not generated randomly.
    private final Key key; 

    private final long expiration = 24 * 60 * 60 * 1000;

    // Use constructor injection and @Value to read the secret from environment (jwt.secret)
    public JwtUtil(@Value("${jwt.secret}") String secret) {
        // CRITICAL FIX: Base64 decode the secret key string for robustness.
        // This guarantees a clean, fixed-length byte array for the key material, 
        // preventing encoding issues during environment variable transfer.
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
                // Explicitly pass the algorithm to match the key derivation
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
            // The parser will use the key's internal algorithm properties (HS512)
            // to validate the token signed with HS512.
            Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            // Log the specific exception to help debug token issues
            System.err.println("[JWT Validation Error] Token rejected: " + e.getMessage());
            return false;
        }
    }
}
