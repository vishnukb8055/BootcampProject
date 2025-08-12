package com.example.TelConnect.controller;

import com.example.TelConnect.model.CustomerPlanMapping;
import com.example.TelConnect.service.CustomerPlanService;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name= "CustomerPlansMapping", description = "Operations related to customers and their respective plans")
@RestController
@RequestMapping("/api/customers/plans")
public class CustomerPlanController {

    private final CustomerPlanService customerPlanService;

    public CustomerPlanController(CustomerPlanService customerPlanService){
        this.customerPlanService=customerPlanService;
    }

    //Handler to enroll new customer and map to a service
    @PostMapping
    public ResponseEntity<String> enrollCustomer(@RequestBody CustomerPlanMapping customerPlanMapping){
        if(customerPlanService.createNewCustomerPlanMapping(customerPlanMapping))
            return ResponseEntity.ok("Customer enrolled");
        else
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to enroll customer");
    }

    //Handler to get status of customer and their plan
    @GetMapping("/{customerId}/status")
    public ResponseEntity<List<CustomerPlanMapping>> getCustomerStatus(@PathVariable Long customerId){
        List<CustomerPlanMapping> response= customerPlanService.getCustomerPlanStatus(customerId);
        if(response.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        return ResponseEntity.ok(response);
    }

    // Update status of the plan chosen by customer
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{customerId}/{planId}/status")
    public ResponseEntity<String> updateStatus(@PathVariable Long customerId, @PathVariable String planId, @RequestParam String status) {
        if (customerPlanService.updateCustomerPlanStatus(customerId, planId, status)) {
            return ResponseEntity.ok("Status updated");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to update status");
        }
    }

    // Handler to get details of all customers and their chosen plans
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<?> getCustomerPlans() {
        List<CustomerPlanMapping> customerPlanMappings=customerPlanService.getAllCustomerPlans();
        if(customerPlanMappings.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        return ResponseEntity.status(HttpStatus.OK).body(customerPlanMappings);
    }

}
