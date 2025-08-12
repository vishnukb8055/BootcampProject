package com.example.TelConnect.controller;

import com.example.TelConnect.DTO.VerificationRequestDTO;
import com.example.TelConnect.model.Verification;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.example.TelConnect.service.VerificationService;

import java.util.List;
import java.util.Map;

@Tag(name= "Verification", description = "Verification operations")
@RestController
@RequestMapping("/api/verification")
public class VerificationController {

    private final VerificationService verificationService;

    public VerificationController(VerificationService verificationService){
        this.verificationService=verificationService;
    }

    //Handler to save verification attempt
    @PostMapping
    public ResponseEntity<String> saveVerification(@RequestBody VerificationRequestDTO newVerificationRequest){
        verificationService.saveVerification(newVerificationRequest);
        return ResponseEntity.ok("New verification request created");
    }

    //Handler to get verification status of customer
    @GetMapping("/{customerId}/status")
    public ResponseEntity<?> getVerificationStatus(@PathVariable Long customerId){
        Map<String, String> response= verificationService.getVerificationStatus(customerId);
        if(response.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No verification request submitted by customer");
        else
            return ResponseEntity.ok(response);

    }

    // Handler to update verification status
    @PatchMapping("/{customerId}/status")
    public ResponseEntity<String> updateVerificationStatus(@PathVariable Long customerId, @RequestParam String status) {
        if(verificationService.updateVerificationStatus(customerId, status))
            return ResponseEntity.ok("Status updated successfully");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No verification request found");
    }


    // Handler to get all the verification attempts
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<?> getAllVerificationAttempts() {
        List<Verification> verificationList= verificationService.getAllVerificationAttempts();
        if(verificationList.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No verification request found");
        return ResponseEntity.status(HttpStatus.OK).body(verificationList);
    }

}
