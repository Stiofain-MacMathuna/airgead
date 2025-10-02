package com.example.finance.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtUtil jwtUtil, UserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
                                    throws ServletException, IOException {

        // Log the start of the filter operation
        System.out.println("[JWT Filter] Processing request for URI: " + request.getRequestURI());

        // We rely on SecurityConfig to permit /api/auth/**. 
        // No need for redundant path skipping here, making the filter cleaner.
        
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("[JWT Filter] No JWT token found in header. Continuing chain.");
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);
        String username = null;
        
        try {
            username = jwtUtil.getUsernameFromToken(token);
            System.out.println("[JWT Filter] Extracted username from token: " + username);
        } catch (Exception e) {
            // Token is malformed or expired (JwtUtil.validateToken handles the catch block and logs it)
            System.err.println("[JWT Filter] Could not extract username or token is invalid/expired: " + e.getMessage());
        }

        // Only process if username is found AND no authentication is currently set (to avoid overwriting)
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            // FIX: Use jwtUtil.validateToken to do the signature check
            if (jwtUtil.validateToken(token)) {
                
                System.out.println("[JWT Filter] Token validated for user: " + username);
                
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                
                // CRITICAL STEP: Set the authentication in the security context
                SecurityContextHolder.getContext().setAuthentication(authToken);
                System.out.println("[JWT Filter] **SUCCESS** SecurityContext set for user: " + username);

            } else {
                System.out.println("[JWT Filter] Token validation failed (Expired/Bad Signature).");
            }
        }
        
        // Log the end state of the security context before passing it on
        if (SecurityContextHolder.getContext().getAuthentication() != null) {
            System.out.println("[JWT Filter] Context is authenticated. Passing to next filter.");
        } else {
            System.out.println("[JWT Filter] Context is NOT authenticated. Passing to next filter. (This will lead to 401 if endpoint is protected!)");
        }

        filterChain.doFilter(request, response);
    }
}
