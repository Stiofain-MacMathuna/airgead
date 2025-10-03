package com.example.finance.controller;

import com.example.finance.model.Account;
import com.example.finance.service.AccountService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    private final AccountService accountService;

    @Autowired
    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }
    
    private String getAuthenticatedUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new IllegalStateException("User not authenticated in security context.");
        }
        return auth.getName();
    }

    @PostMapping("/create")
    public Account createAccount(@RequestBody Map<String, Object> payload) {
        System.out.println("[Controller] Received request to create account.");

        Object accountNameObj = payload.get("accountName");
        String accountName = accountNameObj != null ? accountNameObj.toString() : null;

        String username = getAuthenticatedUsername();

        System.out.println("[Controller] Extracted accountName: " + accountName);
        return accountService.createAccount(username, accountName);
    }


    @GetMapping("/list")
    public List<Account> getAccounts() {
        String username = getAuthenticatedUsername();
        System.out.println("[Controller] Listing accounts for user: " + username);
        return accountService.getAccounts(username);
    }

    @GetMapping("/{id}")
    public Account getAccount(@PathVariable UUID id) {
        return accountService.getAccount(id);
    }
    
    @DeleteMapping("/{id}")
    public void deleteAccount(@PathVariable UUID id) {
        System.out.println("[Controller] Received request to delete account ID: " + id);
        accountService.deleteAccount(id);
    }
}
