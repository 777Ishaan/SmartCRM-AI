package com.smartcrm.controller;

import com.smartcrm.entity.Activity;
import com.smartcrm.entity.Customer;
import com.smartcrm.entity.Lead;
import com.smartcrm.repository.ActivityRepository;
import com.smartcrm.repository.CustomerRepository;
import com.smartcrm.repository.LeadRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
@CrossOrigin(origins = "http://localhost:5173")
public class ActivityController {

    private final ActivityRepository activityRepository;
    private final CustomerRepository customerRepository;
    private final LeadRepository leadRepository;

    public ActivityController(
            ActivityRepository activityRepository,
            CustomerRepository customerRepository,
            LeadRepository leadRepository
    ) {
        this.activityRepository = activityRepository;
        this.customerRepository = customerRepository;
        this.leadRepository = leadRepository;
    }

    @GetMapping
    public List<Activity> getAllActivities() {
        return activityRepository.findAll();
    }

    @GetMapping("/{id}")
    public Activity getActivityById(@PathVariable Long id) {
        return activityRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Activity not found with id: " + id));
    }

    @PostMapping
    public Activity createActivity(@RequestBody Activity activity) {

        setRelatedNames(activity);

        return activityRepository.save(activity);
    }

    @PutMapping("/{id}")
    public Activity updateActivity(
            @PathVariable Long id,
            @RequestBody Activity updatedActivity
    ) {

        Activity activity = activityRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Activity not found with id: " + id));

        activity.setTitle(updatedActivity.getTitle());
        activity.setType(updatedActivity.getType());
        activity.setStatus(updatedActivity.getStatus());
        activity.setPriority(updatedActivity.getPriority());
        activity.setDueDate(updatedActivity.getDueDate());

        activity.setCustomerId(updatedActivity.getCustomerId());
        activity.setLeadId(updatedActivity.getLeadId());

        activity.setNotes(updatedActivity.getNotes());

        setRelatedNames(activity);

        return activityRepository.save(activity);
    }

    @DeleteMapping("/{id}")
    public void deleteActivity(@PathVariable Long id) {

        if (!activityRepository.existsById(id)) {
            throw new RuntimeException("Activity not found with id: " + id);
        }

        activityRepository.deleteById(id);
    }

    private void setRelatedNames(Activity activity) {

        if (activity.getCustomerId() != null) {

            Customer customer = customerRepository
                    .findById(activity.getCustomerId())
                    .orElse(null);

            if (customer != null) {
                activity.setCustomerName(customer.getName());
            }
        } else {
            activity.setCustomerName(null);
        }

        if (activity.getLeadId() != null) {

            Lead lead = leadRepository
                    .findById(activity.getLeadId())
                    .orElse(null);

            if (lead != null) {
                activity.setLeadName(lead.getName());
            }
        } else {
            activity.setLeadName(null);
        }
    }
}