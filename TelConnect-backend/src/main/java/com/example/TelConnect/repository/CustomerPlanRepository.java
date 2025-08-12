package com.example.TelConnect.repository;

import com.example.TelConnect.model.Customer;
import com.example.TelConnect.model.CustomerPlanMapping;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CustomerPlanRepository extends JpaRepository<CustomerPlanMapping, Long> {
    List<CustomerPlanMapping> findByCustomer(Customer customer);
}
