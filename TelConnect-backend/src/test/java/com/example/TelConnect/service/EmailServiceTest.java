package com.example.TelConnect.service;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import com.example.TelConnect.DTO.SecretsCache;
import com.example.TelConnect.model.EmailContent;
import com.example.TelConnect.repository.NotificationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;


class EmailServiceTest {

    private EmailService emailService;

    @InjectMocks
    SecretsCache secretsCache;


    @BeforeEach
    public void setUp() {
        emailService = new EmailService(mock(NotificationService.class), mock(NotificationRepository.class), secretsCache);
    }

    //Test the email method for packaging welcome message
    @Test
    public void testWelcomeMessage() {
        EmailContent emailContent = emailService.WelcomeMessage();

        assertEquals("Welcome to TelConnect! Your Connection Starts Here", emailContent.getSubject());
        assertNotNull(emailContent.getHtmlPart());
        assertNotNull(emailContent.getTextPart());
    }

    //Test the email method for packaging OTP message
    @Test
    public void testOTPMessage() {
        int otp = 123456;
        EmailContent emailContent = emailService.OTPMessage(otp);

        assertEquals("123456 is your 2FA OTP", emailContent.getSubject());
        assertTrue(emailContent.getHtmlPart().contains(String.valueOf(otp)));
    }

    //Test the email method for packaging thank you message
    @Test
    public void testThankYouMessage() {
        EmailContent emailContent = emailService.thankYouMessage();

        assertEquals("Thank You for Choosing TelConnect - Connecting You to What Matters!", emailContent.getSubject());
        assertNotNull(emailContent.getHtmlPart());
    }

    //Test the email method for packaging activation message
    @Test
    public void testServiceActivationMessage() {
        EmailContent emailContent = emailService.ServiceActivationMessage();

        assertEquals("Service Activation", emailContent.getSubject());
        assertNotNull(emailContent.getHtmlPart());
    }


    //Test the OTP generation
    @Test
    public void testGenerateOTP() {
        int otp = emailService.generateOTP();
        assertTrue(otp >= 100000 && otp <= 999999);
    }


    //Test the case where OTP verification fails
    @Test
    public void testVerifyOTP_Failure() {
        String recipient = "test@email.com";
        int otp = emailService.generateOTP();

        assertFalse(emailService.verifyOTP(recipient, otp));
    }
}
