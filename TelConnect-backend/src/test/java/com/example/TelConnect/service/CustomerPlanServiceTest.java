package com.example.TelConnect.service;

import com.example.TelConnect.model.Customer;
import com.example.TelConnect.model.CustomerPlanMapping;
import com.example.TelConnect.model.ServicePlan;
import com.example.TelConnect.repository.CustomerPlanRepository;
import com.example.TelConnect.repository.CustomerRepository;
import com.example.TelConnect.repository.ServicePlanRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CustomerPlanServiceTest {

    @Mock
    private CustomerPlanRepository customerPlanRepository;

    @Mock
    private ServicePlanRepository servicePlanRepository;

    @InjectMocks
    private CustomerPlanService customerPlanService;

    @Mock
    private CustomerRepository customerRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // 1. Test case for adding a new plan when the customer has no existing plan
    @Test
    void testCreateNewCustomerPlanMapping_NewPlan() {
        CustomerPlanMapping newCustomerPlanMapping = Mockito.mock(CustomerPlanMapping.class);

        when(customerPlanRepository.findByCustomer(any(Customer.class))).thenReturn(new ArrayList<CustomerPlanMapping>());

        boolean result = customerPlanService.createNewCustomerPlanMapping(newCustomerPlanMapping);

        assertTrue(result);
        verify(customerPlanRepository, times(1)).save(newCustomerPlanMapping);
    }

    @Test
    void testCreateNewCustomerPlanMapping_ExistingPlan() {
        // Mock the plan
        ServicePlan mockPlan = Mockito.mock(ServicePlan.class);
        when(mockPlan.getPlanId()).thenReturn("test_plan");

        // Mock the existing mapping
        CustomerPlanMapping existingPlan = Mockito.mock(CustomerPlanMapping.class);
        when(existingPlan.getPlan()).thenReturn(mockPlan);

        // Mock the new mapping with the same plan
        CustomerPlanMapping newMapping = Mockito.mock(CustomerPlanMapping.class);
        when(newMapping.getPlan()).thenReturn(mockPlan);
        when(newMapping.getCustomer()).thenReturn(Mockito.mock(Customer.class));

        List<CustomerPlanMapping> existingPlans = new ArrayList<>();
        existingPlans.add(existingPlan);

        when(customerPlanRepository.findByCustomer(any(Customer.class))).thenReturn(existingPlans);

        boolean result = customerPlanService.createNewCustomerPlanMapping(newMapping);

        assertFalse(result);
        verify(customerPlanRepository, never()).save(any());
    }



    // 4. Test case for getting customer plan status when plans exist
    @Test
    void testGetCustomerPlanStatus_WithPlans() {

        CustomerPlanMapping planMapping = new CustomerPlanMapping();
        ServicePlan servicePlan = new ServicePlan();

        Customer customer= new Customer();
        customer.setCustomerId(1L);

        servicePlan.setPlanId("test_plan");

        planMapping.setStatus("Active");
        planMapping.setPlan(servicePlan);
        planMapping.setCustomer(customer);

        // Add the CustomerPlanMapping object to a list
        List<CustomerPlanMapping> customerPlans = new ArrayList<>();
        customerPlans.add(planMapping);


        // Mock the behavior of repositories
        when(customerRepository.findById(anyLong())).thenReturn(Optional.of(customer));
        when(customerPlanRepository.findByCustomer(customer)).thenReturn(customerPlans);

        // Call the method being tested
        List<CustomerPlanMapping> result = customerPlanService.getCustomerPlanStatus(1L);

        // Assert the result size
        assertEquals(1, result.size());

        // Assert the fields of the first (and only) element in the result list
        CustomerPlanMapping resultPlan = result.get(0);
        assertEquals("Active", resultPlan.getStatus());
    }


    // 5. Test case for getting customer plan status when no plans exist
    @Test
    void testGetCustomerPlanStatus_NoPlans() {

        List<CustomerPlanMapping> customerPlans = new ArrayList<>();
        when(customerPlanRepository.findByCustomer(any(Customer.class))).thenReturn(customerPlans);

        List<CustomerPlanMapping> result = customerPlanService.getCustomerPlanStatus(anyLong());

        assertNull(result);
    }

    // 6. Test case for multiple plans under the same customer
    @Test
    void testGetCustomerPlanStatus_MultiplePlans() {

        ServicePlan test_plan1= new ServicePlan();
        ServicePlan test_plan2= new ServicePlan();
        Customer customer = new Customer();
        customer.setCustomerId(1L);

        CustomerPlanMapping plan1 = new CustomerPlanMapping();
        plan1.setPlan(test_plan1);
        plan1.getPlan().setPlanId("plan1");
        plan1.setStatus("Active");
        plan1.setCustomer(customer);

        CustomerPlanMapping plan2 = new CustomerPlanMapping();
        plan2.setPlan(test_plan2);
        plan2.getPlan().setPlanId("plan2");
        plan2.setStatus("Expired");
        plan2.setCustomer(customer);

        List<CustomerPlanMapping> customerPlans = new ArrayList<>();
        customerPlans.add(plan1);
        customerPlans.add(plan2);

        when(customerPlanRepository.findByCustomer(any(Customer.class))).thenReturn(customerPlans);
        when(customerRepository.findById(anyLong())).thenReturn(Optional.of(customer));

        List<CustomerPlanMapping> result = customerPlanService.getCustomerPlanStatus(1L);

        // Assert the size of the result list
        assertEquals(2, result.size());

        // Assert the first element in the list
        CustomerPlanMapping resultPlan1 = result.get(0);
        assertEquals("plan1", resultPlan1.getPlan().getPlanId());
        assertEquals("Active", resultPlan1.getStatus());

        // Assert the second element in the list
        CustomerPlanMapping resultPlan2 = result.get(1);
        assertEquals("plan2", resultPlan2.getPlan().getPlanId());
        assertEquals("Expired", resultPlan2.getStatus());
    }

    // 7. Test case for updating the status of an existing plan
    @Test
    void testUpdateCustomerPlanStatus_ExistingPlan() {
        ServicePlan test_plan= new ServicePlan();
        test_plan.setPlanId("test_plan");

        Customer customer = new Customer();
        customer.setCustomerId(1L);

        CustomerPlanMapping planMapping = new CustomerPlanMapping();
        planMapping.setPlan(test_plan);
        planMapping.setStatus("Active");
        planMapping.setCustomer(customer);

        List<CustomerPlanMapping> customerPlans = new ArrayList<>();
        customerPlans.add(planMapping);

        when(customerRepository.findById(anyLong())).thenReturn(Optional.of(customer));
        when(customerPlanRepository.findByCustomer(any(Customer.class))).thenReturn(customerPlans);

        boolean result = customerPlanService.updateCustomerPlanStatus(1L, "test_plan", "Inactive");

        assertTrue(result);
        assertEquals("Inactive", planMapping.getStatus());
        verify(customerPlanRepository, times(1)).save(planMapping);
    }

    // 8. Test case for failing to update the status when no such plan exists
    @Test
    void testUpdateCustomerPlanStatus_NoSuchPlan() {

        Customer customer = new Customer();
        customer.setCustomerId(1L);

        CustomerPlanMapping planMapping = new CustomerPlanMapping();
        planMapping.setCustomer(customer);

        List<CustomerPlanMapping> customerPlans = new ArrayList<>();
        when(customerRepository.findById(anyLong())).thenReturn(Optional.of(customer));
        when(customerPlanRepository.findByCustomer(any(Customer.class))).thenReturn(customerPlans);

        boolean result = customerPlanService.updateCustomerPlanStatus(1L, anyString(), "Inactive");

        assertFalse(result);
        verify(customerPlanRepository, never()).save(any());
    }

    // Test to get all the customer plans
    @Test
    void testGetAllCustomerPlans() {
        // Prepare test data
        CustomerPlanMapping customerPlan1 = Mockito.mock(CustomerPlanMapping.class);
        CustomerPlanMapping customerPlan2 = Mockito.mock(CustomerPlanMapping.class);

        // Mock repository behavior
        when(customerPlanRepository.findAll()).thenReturn(Arrays.asList(customerPlan1, customerPlan2));

        // Act
        List<CustomerPlanMapping> result = customerPlanService.getAllCustomerPlans();

        // Assert
        assertNotNull(result); // Ensure result is not null
        assertEquals(2, result.size()); // Check if the list contains 2 elements
        assertEquals(customerPlan1, result.get(0)); // Verify the first element
        assertEquals(customerPlan2, result.get(1)); // Verify the second element

        // Verify that the repository's findAll method was called once
        verify(customerPlanRepository, times(1)).findAll();
    }

    @Test
    void testGetAllCustomerPlans_EmptyList() {
        // Mock repository behavior to return an empty list
        when(customerPlanRepository.findAll()).thenReturn(Arrays.asList());

        // Act
        List<CustomerPlanMapping> result = customerPlanService.getAllCustomerPlans();

        // Assert
        assertNotNull(result); // Ensure result is not null
        assertTrue(result.isEmpty()); // Check if the result is an empty list

        // Verify that the repository's findAll method was called once
        verify(customerPlanRepository, times(1)).findAll();
    }
}
