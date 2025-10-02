package com.example.finance.model;

import jakarta.persistence.*;
import java.util.UUID;
import java.util.List; // Import List for the collection of transactions
import java.util.ArrayList; // Import ArrayList for initialization

@Entity
public class Account {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne
    private User user;

    @Column(nullable = false)
    private String name;

    private double balance;
    
    // 1. FIX: Add One-to-Many relationship with Transaction for cascade delete
    // We assume the foreign key column is defined in the Transaction model by 'account'.
    // CascadeType.ALL ensures that if an Account is deleted, all associated Transactions are also deleted.
    // orphanRemoval = true is good practice for managing child entities.
    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Transaction> transactions = new ArrayList<>(); 

    public Account() {}

    public Account(User user, String name, double balance) {
        this.user = user;
        this.name = name;
        this.balance = balance;
    }

    // getters and setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public double getBalance() { return balance; }
    public void setBalance(double balance) { this.balance = balance; }
    
    // New getter/setter for transactions (optional, but good practice)
    public List<Transaction> getTransactions() { return transactions; }
    public void setTransactions(List<Transaction> transactions) { this.transactions = transactions; }
}