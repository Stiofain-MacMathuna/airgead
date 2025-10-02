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
    
    /**
     * Helper method to get the authenticated user's username.
     * @return The username (email) of the currently authenticated user.
     */
    private String getAuthenticatedUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            // Should be impossible if SecurityConfig is set up correctly, 
            // but provides a safe fallback.
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

    /**
     * FIX: Changed to @GetMapping to match frontend request type.
     * FIX: Removed @RequestBody and retrieved username from SecurityContextHolder
     * since the token already contains the necessary user info.
     * Maps to: GET /api/accounts/list
     */
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
    
    /**
     * Deletes an account by its ID.
     * Maps to: DELETE /api/accounts/{id}
     * @param id The UUID of the account to delete.
     */
    @DeleteMapping("/{id}")
    public void deleteAccount(@PathVariable UUID id) {
        System.out.println("[Controller] Received request to delete account ID: " + id);
        // Optional: Add check to ensure the authenticated user owns this account before deleting
        accountService.deleteAccount(id);
    }
}
