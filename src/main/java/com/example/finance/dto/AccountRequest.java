package com.example.finance.dto;

public class AccountRequest {
    private String username;

    public AccountRequest() {}

    public AccountRequest(String username) {
        this.username = username;
    }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
}