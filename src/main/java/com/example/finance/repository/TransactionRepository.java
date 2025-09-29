package com.example.finance.repository;

import com.example.finance.model.Transaction;
import com.example.finance.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TransactionRepository extends JpaRepository<Transaction, UUID> {
    List<Transaction> findByAccount(Account account);
}