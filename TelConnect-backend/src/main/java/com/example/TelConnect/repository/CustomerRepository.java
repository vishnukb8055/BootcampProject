package com.example.TelConnect.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.TelConnect.model.Customer;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Customer findByCustomerEmail(String email);

}