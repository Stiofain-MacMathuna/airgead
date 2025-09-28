package com.example.finance.controller;

import com.example.finance.model.Account;
import com.example.finance.model.Transaction;
import com.example.finance.repository.AccountRepository;
import com.example.finance.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private AccountRepository accountRepository;

    @PostMapping("/deposit")
    public Transaction deposit(@RequestParam UUID accountId, @RequestParam double amount) {
        Account account = accountRepository.findById(accountId).orElseThrow(() -> new RuntimeException("Account not found"));
        account.setBalance(account.getBalance() + amount);
        accountRepository.save(account);

        Transaction txn = new Transaction(account, amount, "DEPOSIT");
        return transactionRepository.save(txn);
    }

    @PostMapping("/withdraw")
    public Transaction withdraw(@RequestParam UUID accountId, @RequestParam double amount) {
        Account account = accountRepository.findById(accountId).orElseThrow(() -> new RuntimeException("Account not found"));
        if (account.getBalance() < amount) throw new RuntimeException("Insufficient funds");
        account.setBalance(account.getBalance() - amount);
        accountRepository.save(account);

        Transaction txn = new Transaction(account, amount, "WITHDRAW");
        return transactionRepository.save(txn);
    }

    @GetMapping("/{accountId}")
    public List<Transaction> getTransactions(@PathVariable UUID accountId) {
        Account account = accountRepository.findById(accountId).orElseThrow(() -> new RuntimeException("Account not found"));
        return transactionRepository.findByAccount(account);
    }
}