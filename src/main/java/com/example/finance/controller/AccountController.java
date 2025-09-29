package com.example.finance.controller;

import com.example.finance.model.Account;
import com.example.finance.model.User;
import com.example.finance.repository.AccountRepository;
import com.example.finance.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public Account createAccount(@RequestParam String username) {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent()) {
            Account account = new Account(user.get(), 0.0);
            return accountRepository.save(account);
        }
        throw new RuntimeException("User not found");
    }

    @GetMapping
    public List<Account> getAccounts(@RequestParam String username) {
        Optional<User> user = userRepository.findByUsername(username);
        return user.map(accountRepository::findByUser).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping("/{id}")
    public Account getAccount(@PathVariable UUID id) {
        return accountRepository.findById(id).orElseThrow(() -> new RuntimeException("Account not found"));
    }
}