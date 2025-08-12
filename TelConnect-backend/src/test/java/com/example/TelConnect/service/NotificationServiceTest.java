package com.example.TelConnect.service;

import com.example.TelConnect.model.Notification;
import com.example.TelConnect.repository.CustomerRepository;
import com.example.TelConnect.repository.NotificationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class NotificationServiceTest {

    @Mock
    private NotificationRepository notificationRepository;

    @InjectMocks
    private NotificationService notificationService;

    @Mock
    private CustomerRepository customerRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    //Test creation of new notification object
    @Test
    void testCreateNotification() {
        Long customerId = 12345L;
        String message = "Your plan has been activated.";

        // Mocking the save operation
        when(notificationRepository.save(any(Notification.class))).thenReturn(new Notification());

        notificationService.createNotification(customerId, message);

        // Verifying that save method is called once
        verify(notificationRepository, times(1)).save(any(Notification.class));
    }

    //Test retrieving the notifications of a customer
    @Test
    void testGetCustomerNotifications() {
        List<Notification> notifications = new ArrayList<>();
        Notification notification1 = new Notification();
        notification1.setMessage("test1");
        notification1.setNotificationTimestamp(LocalDateTime.MIN);

        Map<String, Object> result1= new HashMap<>();
        result1.put("message","test1");
        result1.put("timestamp",LocalDateTime.MIN);

        Notification notification2 = new Notification();
        notification2.setMessage("test2");
        notification2.setNotificationTimestamp(LocalDateTime.MIN);

        Map<String, Object> result2= new HashMap<>();
        result2.put("message","test2");
        result2.put("timestamp",LocalDateTime.MIN);

        notifications.add(notification1);
        notifications.add(notification2);

        // Mocking the findByCustomerId operation
        when(notificationRepository.findByCustomerId(anyLong())).thenReturn(notifications);

        List<Map<String, Object>> result = notificationService.getCustomerNotifications(anyLong());

        assertEquals(2, result.size());

        assertEquals(result1, result.get(0));
        assertEquals(result2, result.get(1));
    }

    //Test retrieving customer notifications when empty
    @Test
    void testGetCustomerNotifications_Empty() {
        Long customerId = 12345L;

        // Mocking the findByCustomerId operation to return an empty list
        when(notificationRepository.findByCustomerId(customerId)).thenReturn(new ArrayList<>());

        List<?> result = notificationService.getCustomerNotifications(customerId);

        // Verifying that the result list is empty
        assertEquals(0, result.size());
    }
}
