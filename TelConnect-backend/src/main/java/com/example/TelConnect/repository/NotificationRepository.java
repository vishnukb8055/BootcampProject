package com.example.TelConnect.repository;

import com.example.TelConnect.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    @Query("SELECT n FROM Notification n WHERE n.customer.customerId = :customerId")
    public List<Notification> findByCustomerId(@Param("customerId") Long customerId);

}
