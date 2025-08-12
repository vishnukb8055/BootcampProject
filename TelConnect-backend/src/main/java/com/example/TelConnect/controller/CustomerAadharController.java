package com.example.TelConnect.controller;
import com.example.TelConnect.model.CustomerAadhar;
import com.example.TelConnect.repository.CustomerAadharRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name= "CustomerAadhaar", description = "Aadhaar retrieval")
@RestController
@RequestMapping("/api/customers/aadhar")
public class CustomerAadharController {

    @Autowired
    private CustomerAadharRepository  customerAadharRepository;

    //Handler to get all aadhaar details from DB
    @GetMapping
    public ResponseEntity<?> getAllPersons() {
        List<CustomerAadhar> customerAadharList= customerAadharRepository.findAll();
        if(customerAadharList.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No records found");

        return ResponseEntity.ok(customerAadharList);
    }
}