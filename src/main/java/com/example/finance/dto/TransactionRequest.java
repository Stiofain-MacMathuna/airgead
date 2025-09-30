package com.example.finance.dto;

import java.util.UUID;

public class TransactionRequest {
    private UUID accountId;
    private double amount;

    public TransactionRequest() {}

    public TransactionRequest(UUID accountId, double amount) {
        this.accountId = accountId;
        this.amount = amount;
    }

    public UUID getAccountId() { return accountId; }
    public void setAccountId(UUID accountId) { this.accountId = accountId; }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }
}