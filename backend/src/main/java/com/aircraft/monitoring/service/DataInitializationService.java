package com.aircraft.monitoring.service;

import com.aircraft.monitoring.model.User;
import com.aircraft.monitoring.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Data initialization service to create default users
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class DataInitializationService implements CommandLineRunner {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        initializeDefaultUsers();
    }
    
    private void initializeDefaultUsers() {
        // Create default admin user if none exists
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@aircraft-monitoring.com");
            admin.setPassword(passwordEncoder.encode("admin123!")); // Default password
            admin.setRole(User.Role.ADMIN);
            admin.setEnabled(true);
            
            userRepository.save(admin);
            log.info("Default admin user created: admin / admin123!");
        }
        
        // Create default operator user if none exists
        if (!userRepository.existsByUsername("operator")) {
            User operator = new User();
            operator.setUsername("operator");
            operator.setEmail("operator@aircraft-monitoring.com");
            operator.setPassword(passwordEncoder.encode("operator123!"));
            operator.setRole(User.Role.OPERATOR);
            operator.setEnabled(true);
            
            userRepository.save(operator);
            log.info("Default operator user created: operator / operator123!");
        }
        
        // Create default viewer user if none exists
        if (!userRepository.existsByUsername("viewer")) {
            User viewer = new User();
            viewer.setUsername("viewer");
            viewer.setEmail("viewer@aircraft-monitoring.com");
            viewer.setPassword(passwordEncoder.encode("viewer123!"));
            viewer.setRole(User.Role.VIEWER);
            viewer.setEnabled(true);
            
            userRepository.save(viewer);
            log.info("Default viewer user created: viewer / viewer123!");
        }
    }
}