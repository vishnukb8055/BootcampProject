package com.example.TelConnect.repository;

import com.example.TelConnect.model.Verification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface VerificationRepository extends JpaRepository<Verification, Long> {

    @Query("SELECT v FROM Verification v WHERE v.customer.customerId = :customerId")
    List<Verification> findByCustomerId(@Param("customerId") Long customerId);
}
