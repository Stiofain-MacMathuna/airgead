package com.example.finance.controller;

import com.example.finance.dto.LoginRequest;
import com.example.finance.dto.RegisterRequest;
import com.example.finance.model.User;
import com.example.finance.service.AuthService;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public User register(@RequestBody RegisterRequest request) {
        System.out.println("[REGISTER] Request received for username: " + request.getUsername());

        User user = new User(request.getUsername(), request.getPassword());
        User savedUser = authService.register(user);

        System.out.println("[REGISTER] User saved: " + savedUser.getUsername());
        return savedUser;
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody LoginRequest request) {
        System.out.println("[LOGIN] Attempt for username: " + request.getUsername());

        User user = new User(request.getUsername(), request.getPassword());
        String token = authService.login(user);

        System.out.println("[LOGIN] Token generated for user: " + request.getUsername());

        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        return response;
    }
}