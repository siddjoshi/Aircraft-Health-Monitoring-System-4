package com.aircraft.monitoring.controller;

import com.aircraft.monitoring.dto.AuthResponse;
import com.aircraft.monitoring.dto.LoginRequest;
import com.aircraft.monitoring.dto.RegisterRequest;
import com.aircraft.monitoring.model.User;
import com.aircraft.monitoring.repository.UserRepository;
import com.aircraft.monitoring.service.CustomUserDetailsService;
import com.aircraft.monitoring.service.JwtTokenService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Authentication Controller
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {
    
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenService jwtTokenService;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );
            
            CustomUserDetailsService.CustomUserPrincipal userPrincipal = 
                    (CustomUserDetailsService.CustomUserPrincipal) authentication.getPrincipal();
            
            User user = userPrincipal.getUser();
            String token = jwtTokenService.generateToken(user.getUsername(), user.getRole().name());
            
            AuthResponse response = new AuthResponse(
                    token,
                    user.getUsername(),
                    user.getEmail(),
                    user.getRole().name(),
                    jwtTokenService.getExpirationLocalDateTimeFromToken(token)
            );
            
            log.info("User logged in successfully: {}", user.getUsername());
            return ResponseEntity.ok(response);
            
        } catch (AuthenticationException e) {
            log.warn("Login failed for user: {}", loginRequest.getUsername());
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid username or password");
            return ResponseEntity.status(401).body(error);
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            // Check if username already exists
            if (userRepository.existsByUsername(registerRequest.getUsername())) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Username already exists");
                return ResponseEntity.badRequest().body(error);
            }
            
            // Check if email already exists
            if (userRepository.existsByEmail(registerRequest.getEmail())) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Email already exists");
                return ResponseEntity.badRequest().body(error);
            }
            
            // Create new user
            User user = new User();
            user.setUsername(registerRequest.getUsername());
            user.setEmail(registerRequest.getEmail());
            user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
            user.setRole(User.Role.valueOf(registerRequest.getRole()));
            
            User savedUser = userRepository.save(user);
            
            // Generate token
            String token = jwtTokenService.generateToken(savedUser.getUsername(), savedUser.getRole().name());
            
            AuthResponse response = new AuthResponse(
                    token,
                    savedUser.getUsername(),
                    savedUser.getEmail(),
                    savedUser.getRole().name(),
                    jwtTokenService.getExpirationLocalDateTimeFromToken(token)
            );
            
            log.info("User registered successfully: {}", savedUser.getUsername());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Registration failed: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", "Registration failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof CustomUserDetailsService.CustomUserPrincipal)) {
            return ResponseEntity.status(401).build();
        }
        
        CustomUserDetailsService.CustomUserPrincipal userPrincipal = 
                (CustomUserDetailsService.CustomUserPrincipal) authentication.getPrincipal();
        
        User user = userPrincipal.getUser();
        
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("id", user.getId());
        userInfo.put("username", user.getUsername());
        userInfo.put("email", user.getEmail());
        userInfo.put("role", user.getRole().name());
        userInfo.put("enabled", user.isEnabled());
        userInfo.put("lastLogin", user.getLastLogin());
        
        return ResponseEntity.ok(userInfo);
    }
}