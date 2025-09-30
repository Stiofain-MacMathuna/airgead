package com.example.finance.controller;

import com.example.finance.dto.AccountRequest;
import com.example.finance.model.Account;
import com.example.finance.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    private final AccountService accountService;

    @Autowired
    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @PostMapping
    public Account createAccount(@RequestBody AccountRequest request) {
        return accountService.createAccount(request.getUsername());
    }

    @PostMapping("/list")
    public List<Account> getAccounts(@RequestBody AccountRequest request) {
        return accountService.getAccounts(request.getUsername());
    }

    @GetMapping("/{id}")
    public Account getAccount(@PathVariable UUID id) {
        return accountService.getAccount(id);
    }
}