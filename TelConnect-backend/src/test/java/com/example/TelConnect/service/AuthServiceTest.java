package com.example.TelConnect.service;

import com.example.TelConnect.DTO.LoginRequestDTO;
import com.example.TelConnect.DTO.RegisterCustomerDTO;
import com.example.TelConnect.model.Customer;
import com.example.TelConnect.model.Role;
import com.example.TelConnect.repository.CustomerRepository;
import com.example.TelConnect.repository.RoleRepository;
import com.example.TelConnect.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class AuthServiceTest {

    @InjectMocks
    private AuthService authService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private CustomerRepository customerRepository;


    @Test
    void testRegisterCustomer() {
        RegisterCustomerDTO newCustomer = Mockito.mock(RegisterCustomerDTO.class);
        when(newCustomer.getCustomerName()).thenReturn("John Doe");
        when(newCustomer.getCustomerEmail()).thenReturn("john@example.com");
        when(newCustomer.getPassword()).thenReturn("test_password");
        when(newCustomer.getCustomerDOB()).thenReturn(LocalDate.of(1990, 1, 1));
        when(newCustomer.getCustomerAddress()).thenReturn("123 Main St");
        when(newCustomer.getCustomerPhno()).thenReturn("1234567890");

        when(passwordEncoder.encode("test_password")).thenReturn("encodedPassword");

        Role mockRole = Mockito.mock(Role.class);
        when(roleRepository.findByRoleName("ROLE_USER")).thenReturn(mockRole);

        Customer savedCustomer = new Customer();
        savedCustomer.setCustomerId(1L);
        when(customerRepository.save(any(Customer.class))).thenReturn(savedCustomer);

        boolean result = authService.register(newCustomer);

        assertTrue(result);
    }



    @Test
    public void testLoginSuccess() {
        LoginRequestDTO loginRequestDTO = new LoginRequestDTO();
        loginRequestDTO.setCustomerEmail("test@example.com");
        loginRequestDTO.setPassword("password123");

        Authentication mockAuthentication = Mockito.mock(Authentication.class);

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(mockAuthentication);

        when(jwtTokenProvider.generateToken(mockAuthentication))
                .thenReturn("mock-jwt-token");

        String token = authService.login(loginRequestDTO);

        assertEquals("mock-jwt-token", token);
        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(jwtTokenProvider, times(1)).generateToken(mockAuthentication);
    }

    @Test
    public void testLoginFailure() {
        LoginRequestDTO loginRequestDTO = new LoginRequestDTO();
        loginRequestDTO.setCustomerEmail("wrong@example.com");
        loginRequestDTO.setPassword("wrongpassword");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Invalid credentials"));

        assertThrows(BadCredentialsException.class, () -> authService.login(loginRequestDTO));

        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(jwtTokenProvider, never()).generateToken(any());
    }


}
