package com.example.TelConnect.controller;

import com.example.TelConnect.DTO.JwtAuthResponse;
import com.example.TelConnect.model.Customer;
import com.example.TelConnect.DTO.RegisterCustomerDTO;
import com.example.TelConnect.DTO.LoginRequestDTO;
import com.example.TelConnect.service.AuthService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.TelConnect.service.CustomerService;

@Tag(name= "Auth", description = "Auth operations")
@RestController
@RequestMapping("/api")
public class AuthController {
    private final CustomerService customerService;
    private final AuthService authService;

    @Autowired
    public AuthController(CustomerService customerService, AuthService authService) {
        this.customerService = customerService;
        this.authService=authService;
    }

    //Handler method to handle login with JWT auth
    @PostMapping("/login")
    public ResponseEntity<JwtAuthResponse> login(@RequestBody LoginRequestDTO loginRequestDTO){
        String token = authService.login(loginRequestDTO);

        JwtAuthResponse jwtAuthResponse= new JwtAuthResponse();
        jwtAuthResponse.setAccessToken(token);

        return new ResponseEntity<>(jwtAuthResponse, HttpStatus.OK);
    }

    // Handler method to handle customer registration with email
    @PostMapping("/register")
    public ResponseEntity<String> registerCustomer(@RequestBody RegisterCustomerDTO newCustomer) {
        Customer existingCustomer = customerService.getByCustomerEmail(newCustomer.getCustomerEmail());

        if (existingCustomer != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("There is already an account registered with the same email");
        }

        if(authService.register(newCustomer))
            return ResponseEntity.status(HttpStatus.CREATED).body("Customer registered successfully");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error while creating new user");
    }

}
