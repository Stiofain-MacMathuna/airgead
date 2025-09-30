package com.example.finance.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AccountCreateRequest {

    @JsonProperty("accountName")
    private String accountName;

    public AccountCreateRequest() {}

    public AccountCreateRequest(String accountName) {
        this.accountName = accountName;
    }

    public String getAccountName() { return accountName; }
    public void setAccountName(String accountName) { this.accountName = accountName; }
}