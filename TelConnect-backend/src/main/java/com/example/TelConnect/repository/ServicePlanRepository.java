package com.example.TelConnect.repository;

import com.example.TelConnect.model.ServicePlan;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServicePlanRepository extends JpaRepository<ServicePlan, String> {
    public ServicePlan findByPlanId(String planId);
}
