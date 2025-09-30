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
        User user = new User(request.getUsername(), request.getPassword());
        return authService.register(user);
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody LoginRequest request) {
        User user = new User(request.getUsername(), request.getPassword());
        String token = authService.login(user);

        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        return response;
    }
}