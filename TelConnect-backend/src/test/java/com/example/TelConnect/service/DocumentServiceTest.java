package com.example.TelConnect.service;

import com.example.TelConnect.model.Customer;
import com.example.TelConnect.model.Document;
import com.example.TelConnect.repository.CustomerRepository;
import com.example.TelConnect.repository.DocumentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class DocumentServiceTest {

    @Mock
    private DocumentRepository documentRepository;

    @Mock
    private CustomerRepository customerRepository;

    @InjectMocks
    private DocumentService documentService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    //Test to save new document entry
    @Test
    void testSaveDocument() {
        Document document = new Document();
        document.setDocumentType("test_type");
        Customer customer = new Customer();
        customer.setCustomerId(1L);
        // Mocking the repository
        when(customerRepository.findById(anyLong())).thenReturn(Optional.of(customer));
        when(documentRepository.save(any(Document.class))).thenReturn(document);

        documentService.saveDocument(1L, "test_type");

        // Verifying that save method is called once
        verify(documentRepository, times(1)).save(any(Document.class));
    }

    //Test to save null document
    @Test
    void testSaveDocument_NullValues() {

        documentService.saveDocument(null, null);

        // Verifying that save method is called even with null values
        verify(documentRepository, times(1)).save(any(Document.class));
    }

    //Test to get documents using customerId
    @Test
    void testGetByCustomerId() {
        List<Document> documents = new ArrayList<>();
        Document document1 = Mockito.mock(Document.class);
        Document document2 = Mockito.mock(Document.class);

        documents.add(document1);
        documents.add(document2);

        // Mocking the findByCustomerId operation
        when(documentRepository.findByCustomerId(anyLong())).thenReturn(documents);

        List<Document> result = documentService.getByCustomerId(anyLong());

        assertEquals(2, result.size());
        assertEquals(document1, result.get(0));
        assertEquals(document2, result.get(1));
    }

    //Test to get documents by customerId when they do not have documents in repository
    @Test
    void testGetByCustomerId_NoDocumentsFound() {

        // Mocking the findByCustomerId operation
        when(documentRepository.findByCustomerId(anyLong())).thenReturn(new ArrayList<>());

        List<Document> result = documentService.getByCustomerId(anyLong());

        assertEquals(0, result.size());
    }

    //Test to get document by Id
    @Test
    void testGetByDocumentId() {
        Document document = Mockito.mock(Document.class);

        // Mocking the findById operation
        when(documentRepository.findById(anyLong())).thenReturn(Optional.of(document));

        Document result = documentService.getByDocumentId(anyLong());

        assertNotNull(result);
    }

    //Test to get non-existing document
    @Test
    void testGetByDocumentId_NotFound() {

        // Mocking the findById operation
        when(documentRepository.findById(anyLong())).thenReturn(Optional.empty());
        Document result = documentService.getByDocumentId(anyLong());

        assertNull(result);
    }

    //Test to retrieve all documents in DB
    @Test
    void testFindAllDocuments() {
        List<Document> documents = new ArrayList<>();
        Document document1 = Mockito.mock(Document.class);

        Document document2 = Mockito.mock(Document.class);

        documents.add(document1);
        documents.add(document2);

        // Mocking the findAll operation
        when(documentRepository.findAll()).thenReturn(documents);

        List<Document> result = documentService.findAllDocuments();

        assertEquals(2, result.size());
        assertEquals(document1, result.get(0));
        assertEquals(document2, result.get(1));
    }

    //Test to find all documents when there are none present
    @Test
    void testFindAllDocuments_EmptyList() {
        // Mocking the findAll operation
        when(documentRepository.findAll()).thenReturn(new ArrayList<>());

        List<Document> result = documentService.findAllDocuments();

        assertEquals(0, result.size());
    }
}
