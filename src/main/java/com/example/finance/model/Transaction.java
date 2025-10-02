package com.example.finance.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonIgnore; // Import for the annotation

@Entity
public class Transaction {

    @Id
    @GeneratedValue
    private UUID id;

    // FIX: Added @JsonIgnore to prevent infinite recursion during JSON serialization.
    // This breaks the loop (Account -> List<Transaction> -> Transaction -> Account)
    @ManyToOne
    @JsonIgnore 
    private Account account;

    private double amount;
    private String type;
    
    // FIX: Added the date field for transaction timestamp
    private Instant date; 

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
    
    // FIX: Getter and setter for the new date field
    public Instant getDate() { return date; }
    public void setDate(Instant date) { this.date = date; }
}