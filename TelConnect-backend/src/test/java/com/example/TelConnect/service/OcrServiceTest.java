package com.example.TelConnect.service;

import com.example.TelConnect.model.CustomerAadhar;
import com.example.TelConnect.repository.CustomerAadharRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class OcrServiceTest {

    @Mock
    private CustomerAadharRepository customerAadharRepository;
    private Process mockProcess;

    @InjectMocks
    private OcrService ocrService;

    @BeforeEach
    void setUp() {

        MockitoAnnotations.openMocks(this);
        mockProcess = Mockito.mock(Process.class);

    }

    //Test recognition of text with valid name from DB
    @Test
    void testRecognizeText_withValidName() throws IOException {
        // Prepare test data
        List<CustomerAadhar> customers = new ArrayList<>();
        CustomerAadhar customer = new CustomerAadhar();
        customer.setCustomerName("test_name");
        customers.add(customer);

        when(customerAadharRepository.findAll()).thenReturn(customers);

        // Simulate the PDF InputStream
        Resource pdfFile = new ClassPathResource("/test-image.png");
        InputStream fileStream = new FileInputStream(pdfFile.getFile());

        // Simulate the OCR result to contain the customer name
        OcrService spyOcrService = spy(ocrService);
        doReturn(List.of(new BufferedImage(100, 100, BufferedImage.TYPE_INT_RGB))).when(spyOcrService).extractImagesFromPdf(fileStream);
        doReturn("test_name").when(spyOcrService).performOcr(any());

        // Act
        String result = spyOcrService.recognizeText(fileStream);

        // Assert
        assertEquals("verified", result);
        verify(customerAadharRepository, times(1)).findAll();
    }

    //Test the OCR retrieving the text from given image (no text in image)
    @Test
    void testPerformOCR_Successful() throws Exception {
        // Arrange
        BufferedImage image = ImageIO.read(Objects.requireNonNull(getClass().getResourceAsStream("/test-image.png")));
        String expectedOutput = "";

        // Set up mock process to return the expected output
        ByteArrayInputStream inputStream = new ByteArrayInputStream(expectedOutput.getBytes());
        when(mockProcess.getInputStream()).thenReturn(inputStream);

        // Act
        String result = ocrService.performOcr(image);

        // Assert
        assertEquals(expectedOutput, result);
    }

    //Test invalid image handler for OCR service
    @Test
    void testPerformOCR_InvalidImage() {

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> ocrService.performOcr(null));
    }

    //Test failure handler of OCR service
    @Test
    void testPerformOcr_withExecutionFailure() throws IOException {
        // Prepare test image
        BufferedImage image = new BufferedImage(100, 100, BufferedImage.TYPE_INT_RGB);

        // Spy on the service to override ProcessBuilder behavior
        OcrService spyOcrService = spy(ocrService);

        // Simulate failure in Tesseract process execution
        doThrow(new IOException("Test Exception")).when(spyOcrService).performOcr(image);

        // Act & Assert
        assertThrows(IOException.class, () -> spyOcrService.performOcr(image));
    }


    //Test OCR service with no text in image
    @Test
    void testPerformOcr_withEmptyText() throws IOException {
        // Prepare test image
        BufferedImage image = new BufferedImage(100, 100, BufferedImage.TYPE_INT_RGB);

        // Spy on the service to return an empty result
        OcrService spyOcrService = spy(ocrService);
        doReturn("").when(spyOcrService).performOcr(image);

        // Act
        String result = spyOcrService.performOcr(image);

        // Assert
        assertEquals("", result); // Expecting empty string
    }

    //Test name mismatch with DB
    @Test
    void testVerifyNameInText_withNoMatches() {
        // Prepare test data with customer names that are not in the text
        List<CustomerAadhar> customers = new ArrayList<>();
        CustomerAadhar customer1 = new CustomerAadhar();
        customer1.setCustomerName("Alice Wonderland");
        customers.add(customer1);

        when(customerAadharRepository.findAll()).thenReturn(customers);

        // Act
        String result = ocrService.verifyNameInText("Some text without any customer names");

        // Assert
        assertNull(result); // No match found
    }

    //Test mismatch of name with text input by user and name coming from OCR
    @Test
    void testRecognizeText_withInvalidName() throws IOException {
        // Prepare test data
        List<CustomerAadhar> customers = new ArrayList<>();
        CustomerAadhar customer = new CustomerAadhar();
        customer.setCustomerName("John Doe");
        customers.add(customer);

        when(customerAadharRepository.findAll()).thenReturn(customers);

        // Simulate the PDF InputStream
        Resource pdfFile = new ClassPathResource("/test-image.png"); // Replace with your sample PDF path
        InputStream fileStream = new FileInputStream(pdfFile.getFile());

        // Simulate the OCR result without the customer name
        OcrService spyOcrService = spy(ocrService);
        doReturn(List.of(new BufferedImage(100, 100, BufferedImage.TYPE_INT_RGB))).when(spyOcrService).extractImagesFromPdf(fileStream);
        doReturn("Unrelated Text").when(spyOcrService).performOcr(any());

        // Act
        String result = spyOcrService.recognizeText(fileStream);

        // Assert
        assertEquals("not_verified", result);
        verify(customerAadharRepository, times(1)).findAll();
    }

    //Test extracting images from PDF
    @Test
    void testExtractImagesFromPdf() throws IOException {
        // Simulate the PDF InputStream
        Resource pdfFile = new ClassPathResource("/test.pdf");
        InputStream fileStream = new FileInputStream(pdfFile.getFile());

        // Act
        List<BufferedImage> images = ocrService.extractImagesFromPdf(fileStream);

        // Assert
        assertNotNull(images);
        assertFalse(images.isEmpty());
    }

    //Test the OCR service to be invoked
    @Test
    void testPerformOcr() throws IOException {
        // Prepare test image
        BufferedImage image = new BufferedImage(100, 100, BufferedImage.TYPE_INT_RGB);

        // Simulate OCR process (tesseract should be mocked since it's an external dependency)
        OcrService spyOcrService = spy(ocrService);
        doReturn("Extracted Text").when(spyOcrService).performOcr(image);

        // Act
        String result = spyOcrService.performOcr(image);

        // Assert
        assertEquals("Extracted Text", result);
    }

    //Test name input from user matching with name in text
    @Test
    void testVerifyNameInText_withValidName() {
        // Prepare test data
        List<CustomerAadhar> customers = new ArrayList<>();
        CustomerAadhar customer = new CustomerAadhar();
        customer.setCustomerName("test_name");
        customers.add(customer);

        when(customerAadharRepository.findAll()).thenReturn(customers);

        // Act
        String result = ocrService.verifyNameInText("Some text containing test_name");

        // Assert
        assertEquals("test_name", result);
    }

    @Test
    void testVerifyNameInText_withInvalidName() {
        // Prepare test data
        List<CustomerAadhar> customers = new ArrayList<>();
        CustomerAadhar customer = new CustomerAadhar();
        customer.setCustomerName("John Doe");
        customers.add(customer);

        when(customerAadharRepository.findAll()).thenReturn(customers);

        // Act
        String result = ocrService.verifyNameInText("Some unrelated text");

        // Assert
        assertNull(result);
    }

    //Test Invalid Tesseract path
    @Test
    void testPerformOcr_withInvalidTesseractPath() throws IOException {
        // Prepare test image
        BufferedImage image = new BufferedImage(100, 100, BufferedImage.TYPE_INT_RGB);

        // Spy on the OcrService to override tesseract path
        OcrService spyOcrService = spy(ocrService);

        // Mock the method to use an invalid tesseract path
        doThrow(new IOException("Invalid Tesseract path")).when(spyOcrService).performOcr(image);

        // Act & Assert
        assertThrows(IOException.class, () -> spyOcrService.performOcr(image));
    }


}
