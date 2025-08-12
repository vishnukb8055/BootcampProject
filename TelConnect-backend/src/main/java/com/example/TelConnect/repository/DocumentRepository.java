package com.example.TelConnect.repository;
import com.example.TelConnect.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    @Query("SELECT d FROM Document d WHERE d.customer.customerId = :customerId")
    List<Document> findByCustomerId(@Param("customerId") Long customerId);
}
