package com.smartcrm.service;

import com.smartcrm.dto.AnalyticsResponse;
import com.smartcrm.repository.ActivityRepository;
import com.smartcrm.repository.AnalyticsRepository;
import com.smartcrm.repository.CustomerRepository;
import com.smartcrm.repository.LeadRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnalyticsService {

    private final CustomerRepository customerRepository;
    private final LeadRepository leadRepository;
    private final ActivityRepository activityRepository;
    private final AnalyticsRepository analyticsRepository;

    public AnalyticsService(
            CustomerRepository customerRepository,
            LeadRepository leadRepository,
            ActivityRepository activityRepository,
            AnalyticsRepository analyticsRepository
    ) {
        this.customerRepository = customerRepository;
        this.leadRepository = leadRepository;
        this.activityRepository = activityRepository;
        this.analyticsRepository = analyticsRepository;
    }

    public AnalyticsResponse getAnalytics() {

        AnalyticsResponse response = new AnalyticsResponse();

        // KPI data
        response.setTotalCustomers(customerRepository.count());
        response.setTotalLeads(leadRepository.count());

        Double pipelineValue = leadRepository.getTotalPipelineValue();
        response.setPipelineValue(
                pipelineValue != null ? pipelineValue : 0
        );

        response.setPendingActivities(
                activityRepository.countByStatus("Pending")
        );

        response.setCompletedActivities(
                activityRepository.countByStatus("Completed")
        );

        // Lead sources
        List<Map<String, Object>> leadSources = new ArrayList<>();

        for (Object[] row : analyticsRepository.getLeadSources()) {

            Map<String, Object> item = new HashMap<>();

            item.put("name", row[0] != null ? row[0] : "Unknown");
            item.put("value", ((Number) row[1]).longValue());

            leadSources.add(item);
        }

        response.setLeadSources(leadSources);

        // Lead statuses
        List<Map<String, Object>> leadStatuses = new ArrayList<>();

        for (Object[] row : analyticsRepository.getLeadStatuses()) {

            Map<String, Object> item = new HashMap<>();

            item.put("name", row[0] != null ? row[0] : "Unknown");
            item.put("value", ((Number) row[1]).longValue());

            leadStatuses.add(item);
        }

        response.setLeadStatuses(leadStatuses);

        // Pipeline by status
        List<Map<String, Object>> pipelineByStatus = new ArrayList<>();

        for (Object[] row : analyticsRepository.getPipelineByStatus()) {

            Map<String, Object> item = new HashMap<>();

            item.put("name", row[0] != null ? row[0] : "Unknown");
            item.put(
                    "value",
                    row[1] != null
                            ? ((Number) row[1]).doubleValue()
                            : 0
            );

            pipelineByStatus.add(item);
        }

        response.setPipelineByStatus(pipelineByStatus);

        // =========================
        // CUSTOMER STATUS
        // =========================

        List<Map<String, Object>> customerStatuses = new ArrayList<>();

        for (Object[] row : analyticsRepository.getCustomerStatuses()) {

            Map<String, Object> item = new HashMap<>();

            item.put(
                    "name",
                    row[0] != null ? row[0] : "Unknown"
            );

            item.put(
                    "value",
                    ((Number) row[1]).longValue()
            );

            customerStatuses.add(item);
        }

        response.setCustomerStatuses(customerStatuses);

        // =========================
        // ACTIVITY TYPES
        // =========================

        List<Map<String, Object>> activityTypes = new ArrayList<>();

        for (Object[] row : activityRepository.getActivityTypes()) {

            Map<String, Object> item = new HashMap<>();

            item.put(
                    "name",
                    row[0] != null ? row[0] : "Unknown"
            );

            item.put(
                    "value",
                    ((Number) row[1]).longValue()
            );

            activityTypes.add(item);
        }

        response.setActivityTypes(activityTypes);

        return response;
    }
}