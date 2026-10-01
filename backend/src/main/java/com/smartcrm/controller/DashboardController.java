package com.smartcrm.controller;

import com.smartcrm.repository.ActivityRepository;
import com.smartcrm.repository.CustomerRepository;
import com.smartcrm.repository.LeadRepository;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {

    private final CustomerRepository customerRepository;
    private final LeadRepository leadRepository;
    private final ActivityRepository activityRepository;

    public DashboardController(
            CustomerRepository customerRepository,
            LeadRepository leadRepository,
            ActivityRepository activityRepository
    ) {
        this.customerRepository = customerRepository;
        this.leadRepository = leadRepository;
        this.activityRepository = activityRepository;
    }

    @GetMapping("/stats")
    public Map<String, Object> getDashboardStats() {

        Map<String, Object> stats = new HashMap<>();

        stats.put("totalCustomers", customerRepository.count());
        stats.put("totalLeads", leadRepository.count());

        stats.put(
                "pendingActivities",
                activityRepository.countByStatus("Pending")
        );

        stats.put(
                "completedActivities",
                activityRepository.countByStatus("Completed")
        );

        stats.put(
                "pipelineValue",
                leadRepository.getTotalPipelineValue()
        );

        return stats;
    }
}