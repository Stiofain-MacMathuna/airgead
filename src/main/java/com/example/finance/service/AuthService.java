package com.example.finance.service;

import com.example.finance.model.User;
import com.example.finance.repository.UserRepository;
import com.example.finance.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // Define the strong password pattern once
    // 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special char (@$!%*?&)
    private static final String STRONG_PASSWORD_REGEX = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$";
    private static final Pattern PASSWORD_PATTERN = Pattern.compile(STRONG_PASSWORD_REGEX);


    @Autowired
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    /**
     * Checks if the given password meets the security requirements.
     * @param password The raw password string.
     * @return true if the password is valid, false otherwise.
     */
    private boolean isPasswordStrong(String password) {
        if (password == null) {
            return false;
        }
        Matcher matcher = PASSWORD_PATTERN.matcher(password);
        return matcher.matches();
    }

    public User register(User user) {
        // --- Server-Side Password Validation (CRITICAL SECURITY STEP) ---
        if (!isPasswordStrong(user.getPassword())) {
            throw new IllegalArgumentException("Password does not meet complexity requirements. Must be 8+ chars, with upper/lower case, a number, and a special character.");
        }
        // ----------------------------------------------------------------

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public String login(User user) {
        Optional<User> existing = userRepository.findByUsername(user.getUsername());
        if (existing.isPresent() && passwordEncoder.matches(user.getPassword(), existing.get().getPassword())) {
            return jwtUtil.generateToken(existing.get().getUsername());
        }
        throw new RuntimeException("Invalid credentials");
    }
}