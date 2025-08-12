package com.example.TelConnect.service;

import com.example.TelConnect.model.ServicePlan;
import com.example.TelConnect.repository.ServicePlanRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ServicePlanServiceTest {

    @Mock
    private ServicePlanRepository servicePlanRepository;

    @InjectMocks
    private ServicePlanService servicePlanService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    //Test creating new plan
    @Test
    void testCreatePlan() {
        ServicePlan plan = Mockito.mock(ServicePlan.class);

        // Mocking the findByPlanId operation
        when(servicePlanRepository.findByPlanId(plan.getPlanId())).thenReturn(null);

        // Mocking the save operation
        when(servicePlanRepository.save(any(ServicePlan.class))).thenReturn(plan);

        boolean result = servicePlanService.createPlan(plan);

        assertTrue(result);
        verify(servicePlanRepository, times(1)).save(any(ServicePlan.class));
    }

    //Test creating existing plan
    @Test
    void testCreatePlanWhenPlanExists() {
        ServicePlan plan = new ServicePlan();
        plan.setPlanId("test_plan");

        // Mocking the findByPlanId operation to return an existing plan
        when(servicePlanRepository.findByPlanId(anyString())).thenReturn(plan);

        boolean result = servicePlanService.createPlan(plan);

        assertFalse(result);
        verify(servicePlanRepository, never()).save(any(ServicePlan.class));
    }

    //Test retrieving plan
    @Test
    void testGetPlan() {
        ServicePlan plan = Mockito.mock(ServicePlan.class);

        // Mocking the findByPlanId operation
        when(servicePlanRepository.findByPlanId(anyString())).thenReturn(plan);

        ServicePlan result = servicePlanService.getPlan(anyString());

        assertNotNull(result);
        assertEquals(plan, result);
    }

    //Test retrieving non-existent plan
    @Test
    void testGetPlanWhenNotFound() {

        // Mocking the findByPlanId operation to return null
        when(servicePlanRepository.findByPlanId(anyString())).thenReturn(null);

        ServicePlan result = servicePlanService.getPlan(anyString());

        assertNull(result);
    }

    //Test get all plans
    @Test
    void testGetAllPlans() {
        List<ServicePlan> plans = new ArrayList<>();
        ServicePlan plan1 = Mockito.mock(ServicePlan.class);
        ServicePlan plan2 = Mockito.mock(ServicePlan.class);

        plans.add(plan1);
        plans.add(plan2);

        // Mocking the findAll operation
        when(servicePlanRepository.findAll()).thenReturn(plans);

        List<ServicePlan> result = servicePlanService.getAllPlans();

        assertEquals(2, result.size());
        assertEquals(plan1, result.get(0));
        assertEquals(plan2, result.get(1));
    }

    //Test deleting plans
    @Test
    void testDeletePlan() {
        // Mocking the deleteById operation
        doNothing().when(servicePlanRepository).deleteById(anyString());

        servicePlanService.deletePlan(anyString());

        // Verifying that deleteById method is called once
        verify(servicePlanRepository, times(1)).deleteById(anyString());
    }

    //Test updating plan
    @Test
    void testUpdatePlan_withValidPlan() {
        // Prepare test data
        String planId = "PLAN123";
        ServicePlan existingPlan = new ServicePlan();
        existingPlan.setPlanId(planId);
        existingPlan.setPlanName("Old Plan");
        existingPlan.setPlanDescription("Old Description");
        existingPlan.setPlanDuration("30 days");
        existingPlan.setPlanPrice("100");

        ServicePlan newPlan = new ServicePlan();
        newPlan.setPlanName("New Plan");
        newPlan.setPlanDescription("New Description");
        newPlan.setPlanDuration("25 days");
        newPlan.setPlanPrice("300");

        // Mock the repository behavior
        when(servicePlanRepository.findByPlanId(anyString())).thenReturn(existingPlan);

        // Act
        boolean result = servicePlanService.updatePlan(newPlan, planId);

        // Assert
        assertTrue(result); // Verify that the method returns true
        assertEquals("New Plan", existingPlan.getPlanName()); // Check if planName was updated
        assertEquals("New Description", existingPlan.getPlanDescription()); // Check if planDescription was updated
        assertEquals("25 days", existingPlan.getPlanDuration()); // Check if planDuration was updated
        assertEquals("300", existingPlan.getPlanPrice()); // Check if planPrice was updated

        // Verify that save was called on the repository
        verify(servicePlanRepository, times(1)).save(existingPlan);
    }

    //Test updating non-existing plan
    @Test
    void testUpdatePlan_withNullPlan() {
        // Prepare test data
        ServicePlan existingPlan = Mockito.mock(ServicePlan.class);

        // Mock the repository behavior
        when(servicePlanRepository.findByPlanId(anyString())).thenReturn(existingPlan);

        // Act
        boolean result = servicePlanService.updatePlan(null, null);

        // Assert
        assertFalse(result); // Verify that the method returns false

        // Verify that save was not called since the plan is null
        verify(servicePlanRepository, never()).save(any());
    }

}
