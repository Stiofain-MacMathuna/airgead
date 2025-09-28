package com.example.finance.model;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
public class Account {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne
    private User user;

    private double balance;

    public Account() {}

    public Account(User user, double balance) {
        this.user = user;
        this.balance = balance;
    }

    // getters and setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public double getBalance() { return balance; }
    public void setBalance(double balance) { this.balance = balance; }
}