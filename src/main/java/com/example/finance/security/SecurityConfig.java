package com.example.finance.security;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import java.util.Arrays;

@Configuration
public class SecurityConfig {

    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;

    public SecurityConfig(UserDetailsService userDetailsService, JwtUtil jwtUtil) {
        this.userDetailsService = userDetailsService;
        this.jwtUtil = jwtUtil;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(jwtUtil, userDetailsService);
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        // Ensure all necessary origins are included
        config.setAllowedOrigins(Arrays.asList(
            "http://20.199.81.36", 
            "http://localhost:5173", 
            "http://localhost:3000",
            "https://airgead.io" 
        ));
        config.addAllowedHeader("*");
        // FIX: Explicitly list all allowed methods instead of using wildcard, 
        // ensuring DELETE is properly recognized by the pre-flight check.
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"));
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // 1. Disable CSRF for stateless API applications (correct)
            .csrf(csrf -> csrf.disable())
            // 2. Allow CORS configuration from the CorsFilter bean
            .cors()
            .and()
            // 3. Define authorization rules
            .authorizeHttpRequests(auth -> auth
                // Allow pre-flight OPTIONS requests (necessary for CORS)
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() 
                // Allow registration and login without token
                .requestMatchers("/api/auth/**").permitAll()          
                // All other API paths require authentication
                .requestMatchers("/api/accounts/**", "/api/transactions/**").authenticated()
                .anyRequest().authenticated()
            )
            // 4. Configure session management as stateless for JWT
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            // 5. Add JWT filter before the standard authentication filter
            .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)
            // 6. Handle authentication exceptions
            .exceptionHandling(exception -> exception
                .authenticationEntryPoint(
                    (req, res, authException) -> res.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized")
                )
            );

        return http.build();
    }
}
