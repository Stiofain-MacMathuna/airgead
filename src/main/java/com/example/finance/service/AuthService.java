package com.example.finance.service;

import com.example.finance.model.User;
import com.example.finance.repository.UserRepository;
import com.example.finance.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Autowired
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public User register(User user) {
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
