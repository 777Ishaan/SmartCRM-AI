package com.smartcrm.controller;

import com.smartcrm.dto.LoginRequest;
import com.smartcrm.dto.LoginResponse;
import com.smartcrm.dto.RegisterRequest;
import com.smartcrm.dto.UserResponse;
import com.smartcrm.entity.User;
import com.smartcrm.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(
            @Valid @RequestBody RegisterRequest request
    ) {

        User user = authService.register(
                request.getName(),
                request.getEmail(),
                request.getPassword(),
                request.getRole()
        );

        return ResponseEntity.ok(
                UserResponse.fromUser(user)
        );
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request
    ) {

        String token = authService.login(
                request.getEmail(),
                request.getPassword()
        );

        User user = authService.findByEmail(
                request.getEmail()
        );

        LoginResponse response = new LoginResponse(
                token,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );

        return ResponseEntity.ok(response);
    }
}