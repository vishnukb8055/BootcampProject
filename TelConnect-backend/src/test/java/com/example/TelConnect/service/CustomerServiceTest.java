package com.example.TelConnect.service;

import com.example.TelConnect.DTO.UpdateRequestDTO;
import com.example.TelConnect.model.Customer;
import com.example.TelConnect.repository.CustomerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CustomerServiceTest {

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private CustomerService customerService;


    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }


    @Test
    void testGetByCustomerEmail() {
        Customer customer = new Customer();
        customer.setCustomerEmail("test@email.com");

        when(customerRepository.findByCustomerEmail(anyString())).thenReturn(customer);

        Customer result = customerService.getByCustomerEmail("test@email.com");

        assertNotNull(result);
        assertEquals("test@email.com", result.getCustomerEmail());
    }

    @Test
    void testGetByCustomerId_CustomerExists() {
        // Prepare test data
        Customer customer = new Customer();
        customer.setCustomerId(1L);

        // Mock the repository behavior
        when(customerRepository.findById(anyLong())).thenReturn(Optional.of(customer));

        // Act
        Customer result = customerService.getByCustomerId(anyLong());

        // Assert
        assertNotNull(result); // Verify that the method returns a non-null customer
        assertEquals(1L, result.getCustomerId()); // Check if the correct customer is returned

        // Verify that findById was called once on the repository
        verify(customerRepository, times(1)).findById(anyLong());
    }

    @Test
    void testGetByCustomerId_CustomerDoesNotExist() {
        // Prepare test data
        // Mock the repository behavior to return an empty Optional
        when(customerRepository.findById(anyLong())).thenReturn(Optional.empty());

        // Act
        Customer result = customerService.getByCustomerId(1L);

        // Assert
        assertNull(result); // Verify that the method returns null when the customer doesn't exist

        // Verify that findById was called once on the repository
        verify(customerRepository, times(1)).findById(1L);
    }

    @Test
    void testFindAllCustomers() {
        List<Customer> customers = new ArrayList<>();

        Customer customer1 = Mockito.mock(Customer.class);
        Customer customer2 = Mockito.mock(Customer.class);
        customers.add(customer1);
        customers.add(customer2);

        when(customerRepository.findAll()).thenReturn(customers);

        List<Customer> result = customerService.findAllCustomers();

        assertEquals(2, result.size());

    }

    @Test
    void testDeleteCustomer_Success() {
        Customer mockCustomer = Mockito.mock(Customer.class);
        when(mockCustomer.getCustomerId()).thenReturn(1L);

        when(customerRepository.findByCustomerEmail(anyString())).thenReturn(mockCustomer);

        boolean result = customerService.deleteCustomer("any.email@example.com");

        assertTrue(result);
        verify(customerRepository, times(1)).deleteById(1L);
    }


    @Test
    void testDeleteCustomer_NotFound() {
        when(customerRepository.findByCustomerEmail(anyString())).thenReturn(null);

        boolean result = customerService.deleteCustomer("john.doe@example.com");

        assertFalse(result);
        verify(customerRepository, never()).deleteById(anyLong());
    }


    @Test
    void testUpdateCustomerDetails_Success() {
        UpdateRequestDTO updateRequestDTO = new UpdateRequestDTO();
        updateRequestDTO.setPassword("test_password");
        updateRequestDTO.setCustomerEmail("test@email.com");

        Customer mockCustomer = new Customer();
        mockCustomer.setCustomerEmail("test@email.com");
        mockCustomer.setCustomerId(111L);
        when(customerRepository.findByCustomerEmail(anyString())).thenReturn(mockCustomer);
        when(passwordEncoder.encode("test_password")).thenReturn("encodedPassword");

        boolean result = customerService.updateCustomerDetails(updateRequestDTO);

        assertTrue(result);
    }


    @Test
    void testUpdateCustomerDetails_Failure_CustomerNotFound() {
        UpdateRequestDTO updateRequestDTO = new UpdateRequestDTO();
        updateRequestDTO.setCustomerEmail("nonexistent@example.com");

        when(customerRepository.findByCustomerEmail("nonexistent@example.com")).thenReturn(null);

        boolean result = customerService.updateCustomerDetails(updateRequestDTO);

        assertFalse(result);
        verify(customerRepository, never()).save(any());
    }


}
