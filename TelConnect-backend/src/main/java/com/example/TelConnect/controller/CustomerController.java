package com.example.TelConnect.controller;

import com.example.TelConnect.model.Customer;
import com.example.TelConnect.DTO.UpdateRequestDTO;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.example.TelConnect.service.CustomerService;

import java.util.List;

@Tag(name= "Customer", description = "Customer details operations")
@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService customerService;

    @Autowired
    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }


    //Handler to get one customer
    @GetMapping("/{customerEmail}")
    public ResponseEntity<Customer> getCustomerByEmail(@PathVariable String customerEmail) {
        Customer customer=customerService.getByCustomerEmail(customerEmail);
        if(customer!=null)
            return ResponseEntity.ok(customer);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);

    }

    //Handler to get one customer using customerId
    @GetMapping("/Id={customerId}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable Long customerId){
        if(customerId==1)
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        Customer customer= customerService.getByCustomerId(customerId);
        if(customer==null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);

        return ResponseEntity.ok(customer);
    }

    //Handler to update customer details
    @PatchMapping("/{customerEmail}")
    public ResponseEntity<String> updateCustomer(@PathVariable String customerEmail,@RequestBody UpdateRequestDTO updateCustomer){
        updateCustomer.setCustomerEmail(customerEmail);
        boolean updateStatus =customerService.updateCustomerDetails(updateCustomer);
        if (updateStatus)
            return ResponseEntity.ok("Update Success");

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Account does not exist with this email");

    }

    //Handler to get all customers, admin only
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<?> getCustomers() {
        List<Customer> customers = customerService.findAllCustomers();
        if(customers.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        return ResponseEntity.ok(customers);
    }

    // Modify method to delete customer, admin only
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{customerEmail}")
    public ResponseEntity<String> deleteCustomer(@PathVariable String customerEmail) {
        if (customerService.deleteCustomer(customerEmail)) {
            return ResponseEntity.ok("Customer Deleted");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Customer not found");
        }
    }
}
