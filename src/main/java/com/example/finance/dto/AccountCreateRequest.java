package com.example.finance.dto;

public class AccountCreateRequest {
    private String accountName;

    public AccountCreateRequest() {}

    public AccountCreateRequest(String accountName) {
        this.accountName = accountName;
    }

    public String getAccountName() { return accountName; }
    public void setAccountName(String accountName) { this.accountName = accountName; }
}