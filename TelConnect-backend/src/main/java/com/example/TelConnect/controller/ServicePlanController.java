package com.example.TelConnect.controller;

import com.example.TelConnect.model.ServicePlan;
import com.example.TelConnect.service.ServicePlanService;

import io.swagger.v3.oas.annotations.tags.Tag;
import okhttp3.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name= "Plans", description = "Service plans operations")
@RestController
@RequestMapping("/api/plans")
public class ServicePlanController {

    private ServicePlanService servicePlanService;

    public ServicePlanController(ServicePlanService servicePlanService){
        this.servicePlanService=servicePlanService;
    }

    //Handler to get plan details using Id
    @GetMapping("/{planId}")
    public ResponseEntity<ServicePlan> getPlan(@PathVariable String planId){
        ServicePlan plan= servicePlanService.getPlan(planId);
        if(plan!=null)
            return ResponseEntity.ok(plan);
        else
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }

    //Handler to get all the plans
    @GetMapping
    public ResponseEntity<List<ServicePlan>> getAllPlans(){
        List<ServicePlan> plans= servicePlanService.getAllPlans();
        if(plans.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        else
            return ResponseEntity.ok(plans);

    }

    // Handler to create a new plan
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/newPlan")
    public ResponseEntity<String> createPlan(@RequestBody ServicePlan plan) {
        if (servicePlanService.createPlan(plan)) {
            return ResponseEntity.ok("New plan created");
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("PlanId already exists");
        }
    }

    // Handler to delete existing plans
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/deletePlan/planID={planId}")
    public ResponseEntity<String> deletePlan(@PathVariable String planId) {
        servicePlanService.deletePlan(planId);
        return ResponseEntity.ok("Plan Deleted");
    }

    // Handler to edit existing plans
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/editPlan/planID={planId}")
    public ResponseEntity<String> updatePlan(@PathVariable String planId, @RequestBody ServicePlan plan) {
        if (servicePlanService.updatePlan(plan, planId)) {
            return ResponseEntity.ok("Plan updated");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Plan not found");
        }
    }

}
