package com.example.TelConnect.service;

import com.example.TelConnect.model.Customer;
import com.example.TelConnect.model.Verification;
import com.example.TelConnect.DTO.VerificationRequestDTO;
import com.example.TelConnect.repository.CustomerRepository;
import com.example.TelConnect.repository.DocumentRepository;
import com.example.TelConnect.repository.VerificationRepository;
import com.example.TelConnect.model.Document;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;


@Service
public class VerificationService {

    private final VerificationRepository verificationRepository;
    private final CustomerRepository customerRepository;
    private final DocumentRepository documentRepository;

    public VerificationService(VerificationRepository verificationRepository,DocumentRepository documentRepository, CustomerRepository customerRepository){
        this.verificationRepository= verificationRepository;
        this.customerRepository=customerRepository;
        this.documentRepository=documentRepository;
    }

    //Save verification status as failed by default for a customer and document
    public void saveVerification(VerificationRequestDTO newVerificationRequest){
        Verification verification= new Verification();
        Customer customer=customerRepository.findById(newVerificationRequest.getCustomerId()).orElse(null);
        Document document=documentRepository.findById(newVerificationRequest.getDocumentId()).orElse(null);
        verification.setCustomer(customer);
        verification.setDocument(document);
        verification.setRequestDate(LocalDateTime.now());
        verification.setRequestStatus("failed");

        verificationRepository.save(verification);
    }

    //Get verification status of a customer
    public Map<String, String> getVerificationStatus(Long customerId) {

        // Get the list of verifications for the given customer ID
        List<Verification> verifications = verificationRepository.findByCustomerId(customerId);
        Map<String, String> statusMap = new HashMap<>();

        for (Verification verification : verifications) {
            // Extract document ID and status from each verification
            Long documentId = verification.getDocument().getDocumentId();
            String status = verification.getRequestStatus();

            // Get the document type using the document repository
            Document document = documentRepository.findById(documentId).orElse(null);
            if (document != null) {
                String documentType = document.getDocumentType();
                statusMap.put(documentType, status);
            }
        }

        return statusMap;
    }


    //Update verification status of a customer
    public boolean updateVerificationStatus(Long customerId, String status) {
        String documentType= "Aadhaar";
        // Get the list of verifications for the given customer ID
        List<Verification> verifications = verificationRepository.findByCustomerId(customerId);
        AtomicBoolean updateFlag= new AtomicBoolean(false);

        // Use streams to find the verification that matches the given document type
        verifications.stream()
                .filter(verification -> {
                    // Retrieve the document using the document repository
                    Document document = documentRepository.findById(verification.getDocument().getDocumentId()).orElse(null);
                    // Check if the document type matches
                    return document != null && documentType.equals(document.getDocumentType());
                })
                .findFirst() // Get the first matching verification, if any
                .ifPresent(verification -> {
                    // Update the status of the found verification
                    verification.setRequestStatus(status);
                    verificationRepository.save(verification); // Save the updated verification
                    updateFlag.set(true);
                });
        return updateFlag.get();
    }

    //Get all the verification attempts
    public List<Verification> getAllVerificationAttempts(){
        return verificationRepository.findAll();
    }
}
