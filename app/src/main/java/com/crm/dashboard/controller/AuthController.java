package com.crm.dashboard.controller;

import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        boolean success = "admin".equals(username) && "password".equals(password);

        if (success) {
            return Map.of("status", "success", "message", "Login successful");
        } else {
            return Map.of("status", "error", "message", "Invalid credentials");
        }
    }
}