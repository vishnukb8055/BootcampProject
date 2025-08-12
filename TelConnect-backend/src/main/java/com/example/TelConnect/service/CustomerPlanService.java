package com.example.TelConnect.service;

import com.example.TelConnect.model.Customer;
import com.example.TelConnect.model.CustomerPlanMapping;
import com.example.TelConnect.repository.CustomerPlanRepository;
import com.example.TelConnect.repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class CustomerPlanService {

    private final CustomerPlanRepository customerPlanRepository;

    private final CustomerRepository customerRepository;

    public CustomerPlanService(CustomerPlanRepository customerPlanRepository, CustomerRepository customerRepository){
        this.customerPlanRepository=customerPlanRepository;
        this.customerRepository=customerRepository;
    }

    //Service to create a new mapping between customer and a selected plan
    public boolean createNewCustomerPlanMapping(CustomerPlanMapping newCustomerPlanMapping){
        List<CustomerPlanMapping> customerPlans = customerPlanRepository.findByCustomer(newCustomerPlanMapping.getCustomer());
        //If customer already has plans
        if (!customerPlans.isEmpty()) {
            for (CustomerPlanMapping customerPlan : customerPlans) {
                //If customer already has the same plan
                if (Objects.equals(customerPlan.getPlan().getPlanId(), newCustomerPlanMapping.getPlan().getPlanId()))
                    return false;
            }
        }
        customerPlanRepository.save(newCustomerPlanMapping);
        return true;
    }


    //Service to get the status of an existing customer and their existing plans (if present)
    public List<CustomerPlanMapping> getCustomerPlanStatus(Long customerId) {
        Customer customer = customerRepository.findById(customerId).orElse(null);
        List<CustomerPlanMapping> customerPlans = customerPlanRepository.findByCustomer(customer);

        //If customer has plans
        if (!customerPlans.isEmpty()) {
            return customerPlans;
        } else {
            return null;
        }
    }

    //Service to update the plan status (invoked after admin approves the plan)
    public boolean updateCustomerPlanStatus(Long customerId, String planId, String status){
        Customer customer = customerRepository.findById(customerId).orElse(null);
        List<CustomerPlanMapping> customerPlans = customerPlanRepository.findByCustomer(customer);        //If customer has the specified plan
        if (!customerPlans.isEmpty()) {
            for (CustomerPlanMapping customerPlan : customerPlans) {
                if(customerPlan.getPlan().getPlanId().equals(planId)) {
                    customerPlan.setStatus(status);
                    customerPlanRepository.save(customerPlan);
                    return true;
                }

            }
        }
        return false;
    }

    //Utility method to get all customer and plans mappings
    public List<CustomerPlanMapping> getAllCustomerPlans(){
        return customerPlanRepository.findAll();
    }

}
