package com.example.finance.service;

import com.example.finance.model.Account;
import com.example.finance.model.Transaction;
import com.example.finance.repository.AccountRepository;
import com.example.finance.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;

    @Autowired
    public TransactionService(TransactionRepository transactionRepository, AccountRepository accountRepository) {
        this.transactionRepository = transactionRepository;
        this.accountRepository = accountRepository;
    }

    public Transaction deposit(UUID accountId, double amount) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        account.setBalance(account.getBalance() + amount);
        accountRepository.save(account);

        Transaction txn = new Transaction(account, amount, "DEPOSIT");
        return transactionRepository.save(txn);
    }

    public Transaction withdraw(UUID accountId, double amount) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        if (account.getBalance() < amount) {
            throw new RuntimeException("Insufficient funds");
        }
        account.setBalance(account.getBalance() - amount);
        accountRepository.save(account);

        Transaction txn = new Transaction(account, amount, "WITHDRAW");
        return transactionRepository.save(txn);
    }

    public List<Transaction> getTransactions(UUID accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        return transactionRepository.findByAccount(account);
    }
}