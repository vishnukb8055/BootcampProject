package com.example.TelConnect.service;

import com.example.TelConnect.model.Customer;
import com.example.TelConnect.model.Verification;
import com.example.TelConnect.DTO.VerificationRequestDTO;
import com.example.TelConnect.model.Document;
import com.example.TelConnect.repository.CustomerRepository;
import com.example.TelConnect.repository.DocumentRepository;
import com.example.TelConnect.repository.VerificationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import javax.print.Doc;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class VerificationServiceTest {

    @Mock
    private VerificationRepository verificationRepository;


    @InjectMocks
    private VerificationService verificationService;

    @Mock
    private DocumentRepository documentRepository;

    @Mock
    private CustomerRepository customerRepository;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    //Test saving new verification request
    @Test
    void testSaveVerification() {
        VerificationRequestDTO requestDTO = Mockito.mock(VerificationRequestDTO.class);
        Customer mockCustomer= new Customer();
        Document mockDocument= new Document();

        when(customerRepository.findById(anyLong())).thenReturn(Optional.of(mockCustomer));
        when(documentRepository.findById(anyLong())).thenReturn(Optional.of(mockDocument));
        verificationService.saveVerification(requestDTO);

        verify(verificationRepository, times(1)).save(any(Verification.class));
    }

    //Test retrieving verification status
    @Test
    void testGetVerificationStatus() {
        List<Verification> mockVerifications = new ArrayList<>();
        Verification verification = new Verification();
        Document document= new Document();
        document.setDocumentType("test_type");
        document.setDocumentId(1L);

        verification.setRequestStatus("Failed");
        verification.setDocument(document);

        Map<String, String> expectedResult= new HashMap<>();
        expectedResult.put("test_type","Failed");

        mockVerifications.add(verification);

        when(verificationRepository.findByCustomerId(anyLong())).thenReturn(mockVerifications);
        when(documentRepository.findById(anyLong())).thenReturn(Optional.of(document));

        Map<String, String> result = verificationService.getVerificationStatus(anyLong());

        assertEquals(expectedResult, result);
    }

    //Test retrieving non-existent verification request
    @Test
    void testGetVerificationStatus_Empty() {
        when(verificationRepository.findByCustomerId(anyLong())).thenReturn(new ArrayList<>());

        Map<String, String> result = verificationService.getVerificationStatus(anyLong());
        assertEquals(new HashMap<>(), result);
    }

    //Test updating verification request status
    @Test
    void testUpdateVerificationStatus() {
        List<Verification> mockVerifications = new ArrayList<>();
        Verification verification = new Verification();
        Document mockDocument = new Document();

        Long customerId = 1L;

        mockDocument.setDocumentId(1L);
        mockDocument.setDocumentType("Aadhaar");

        verification.setDocument(mockDocument);

        mockVerifications.add(verification);

        when(verificationRepository.findByCustomerId(customerId)).thenReturn(mockVerifications);
        when(documentRepository.findById(1L)).thenReturn(Optional.of(mockDocument));

        verificationService.updateVerificationStatus(customerId, "success");

        verify(verificationRepository, times(1)).save(verification);
        assertEquals("success", verification.getRequestStatus());
    }


    //Test updating verification status of non-existent document
    @Test
    void testUpdateVerificationStatus_NoMatchingDocument() {
        List<Verification> mockVerifications = new ArrayList<>();
        Verification verification = new Verification();
        Document mockDocument = new Document();

        mockDocument.setDocumentId(1L);

        verification.setDocument(mockDocument);

        verification.setRequestStatus("failed");
        mockVerifications.add(verification);

        when(verificationRepository.findByCustomerId(anyLong())).thenReturn(mockVerifications);
        when(documentRepository.findById(anyLong())).thenReturn(Optional.empty());

        boolean result = verificationService.updateVerificationStatus(anyLong(), "success");
        assertFalse(result);

        verify(verificationRepository, never()).save(any());
        assertEquals("failed", verification.getRequestStatus());
    }

    //Test retrieve all verification attempts
    @Test
    void testGetAllVerificationAttempts() {
        List<Verification> mockVerifications = new ArrayList<>();
        Verification verification = Mockito.mock(Verification.class);
        mockVerifications.add(verification);

        when(verificationRepository.findAll()).thenReturn(mockVerifications);

        List<Verification> result = verificationService.getAllVerificationAttempts();

        assertEquals(1, result.size());
        assertEquals(verification, result.get(0));
    }
}
