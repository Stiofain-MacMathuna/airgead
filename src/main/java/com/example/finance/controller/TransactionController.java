package com.example.finance.controller;

import com.example.finance.dto.TransactionRequest;
import com.example.finance.model.Transaction;
import com.example.finance.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    @Autowired
    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping("/deposit")
    public Transaction deposit(@RequestBody TransactionRequest request) {
        return transactionService.deposit(request.getAccountId(), request.getAmount());
    }

    @PostMapping("/withdraw")
    public Transaction withdraw(@RequestBody TransactionRequest request) {
        return transactionService.withdraw(request.getAccountId(), request.getAmount());
    }

    @GetMapping("/{accountId}")
    public List<Transaction> getTransactions(@PathVariable UUID accountId) {
        return transactionService.getTransactions(accountId);
    }
}