package com.example.TelConnect.service;

import com.example.TelConnect.model.Customer;
import com.example.TelConnect.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.TelConnect.model.Notification;
import com.example.TelConnect.repository.NotificationRepository;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class NotificationService {
    @Autowired
    private final NotificationRepository notificationRepository;
    private final CustomerRepository customerRepository;

    public NotificationService(NotificationRepository notificationRepository, CustomerRepository customerRepository){
        this.notificationRepository=notificationRepository;
        this.customerRepository=customerRepository;
    }

    //Create notification record when email is pushed to customer
    public void createNotification(Long customerId, String message) {

        Notification notification= new Notification();
        Customer customer= customerRepository.findById(customerId).orElse(null);
        notification.setCustomer(customer);
        notification.setNotificationTimestamp(LocalDateTime.now());
        notification.setMessage(message);

        notificationRepository.save(notification);
    }

    //Get all notifications pushed to customer
    public List<Map<String, Object>> getCustomerNotifications(Long customerId) {
        List<Notification> notifications = notificationRepository.findByCustomerId(customerId);
        return notifications.stream()
                .map(notification -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("message", notification.getMessage());
                    map.put("timestamp", notification.getNotificationTimestamp());
                    return map;
                })
                .collect(Collectors.toList());

    }

}