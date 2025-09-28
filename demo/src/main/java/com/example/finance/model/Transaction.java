package com.example.finance.model;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
public class Transaction {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne
    private Account account;

    private double amount;
    private String type; // DEPOSIT or WITHDRAW

    public Transaction() {}

    public Transaction(Account account, double amount, String type) {
        this.account = account;
        this.amount = amount;
        this.type = type;
    }

    // getters and setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public Account getAccount() { return account; }
    public void setAccount(Account account) { this.account = account; }
    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}