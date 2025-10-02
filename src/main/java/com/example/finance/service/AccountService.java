package com.example.finance.service;

import com.example.finance.model.Account;
import com.example.finance.model.User;
import com.example.finance.repository.AccountRepository;
import com.example.finance.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class AccountService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    @Autowired
    public AccountService(AccountRepository accountRepository, UserRepository userRepository) {
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
    }

    public Account createAccount(String username, String accountName) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Account account = new Account();
        account.setUser(user);
        account.setName(accountName);
        account.setBalance(0.0);

        System.out.println("[Service] Creating account with name: " + accountName);
        return accountRepository.save(account);
    }

    /**
     * Deletes an account by ID.
     * Checks if the account has a zero balance before deletion and cascades deletion to transactions.
     * @param id The UUID of the account to delete.
     * @throws IllegalStateException if the account balance is not zero.
     */
    public void deleteAccount(UUID id) {
        Account account = accountRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Account not found with ID: " + id));

        // FIX: 1. Prevent deletion if balance is non-zero (Business Rule)
        // This addresses the user request for requiring fund withdrawal first.
        if (account.getBalance() != 0.0) {
            // Throw an exception that the controller can catch and return an appropriate HTTP status code (e.g., 409 Conflict)
            throw new IllegalStateException("Cannot delete account with a non-zero balance. Please withdraw all funds first.");
        }
        
        // FIX: 2. Proceed with deletion. 
        // Thanks to CascadeType.ALL on the 'transactions' collection in the Account Canvas, 
        // related Transaction records will be deleted automatically before the Account is deleted, 
        // resolving the foreign key constraint violation (SQLState: 23503).
        accountRepository.delete(account);
        System.out.println("[Service] Deleted account with ID: " + id);
    }


    public List<Account> getAccounts(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return accountRepository.findByUser(user);
    }

    public Account getAccount(UUID id) {
        return accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found"));
    }
}