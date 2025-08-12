package com.example.TelConnect.service;

import com.example.TelConnect.model.Customer;
import com.example.TelConnect.model.Document;
import com.example.TelConnect.repository.CustomerRepository;
import com.example.TelConnect.repository.DocumentRepository;
import org.springframework.stereotype.Service;


import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final CustomerRepository customerRepository;

    public DocumentService(DocumentRepository documentRepository, CustomerRepository customerRepository){
        this.documentRepository = documentRepository;
        this.customerRepository=customerRepository;
    }

    //Save new document entry
    public void saveDocument(Long customerId, String DocumentType){

        Document document= new Document();
        Customer customer= customerRepository.findById(customerId).orElse(null);
        document.setCustomer(customer);
        document.setUploadDate(LocalDate.now());
        document.setDocumentType(DocumentType);

        documentRepository.save(document);
    }

    //Get documents of customer
    public List<Document> getByCustomerId(Long customerId ){
        List<Document> documents= documentRepository.findByCustomerId(customerId);
        return documents.stream()
                .map(this::convertEntity)
                .collect(Collectors.toList());
    }

    //Get document by Id
    public Document getByDocumentId(Long documentId){
        return documentRepository.findById(documentId).orElse(null);
    }

    //Get all the documents of all customers
    public List<Document> findAllDocuments() {
        List<Document> documents = documentRepository.findAll();
        return documents.stream()
                .map(this::convertEntity)
                .collect(Collectors.toList());
    }

    private Document convertEntity(Document document) {
        document.setDocumentId(document.getDocumentId());
        return document;
    }
}
