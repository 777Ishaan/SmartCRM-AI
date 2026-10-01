package com.smartcrm.dto;

import java.util.List;
import java.util.Map;

public class AnalyticsResponse {

    private long totalCustomers;
    private long totalLeads;
    private double pipelineValue;
    private long pendingActivities;
    private long completedActivities;

    private List<Map<String, Object>> leadSources;
    private List<Map<String, Object>> leadStatuses;
    private List<Map<String, Object>> pipelineByStatus;

    private List<Map<String, Object>> customerStatuses;
    private List<Map<String, Object>> activityTypes;

    public AnalyticsResponse() {
    }

    public long getTotalCustomers() {
        return totalCustomers;
    }

    public void setTotalCustomers(long totalCustomers) {
        this.totalCustomers = totalCustomers;
    }

    public long getTotalLeads() {
        return totalLeads;
    }

    public void setTotalLeads(long totalLeads) {
        this.totalLeads = totalLeads;
    }

    public double getPipelineValue() {
        return pipelineValue;
    }

    public void setPipelineValue(double pipelineValue) {
        this.pipelineValue = pipelineValue;
    }

    public long getPendingActivities() {
        return pendingActivities;
    }

    public void setPendingActivities(long pendingActivities) {
        this.pendingActivities = pendingActivities;
    }

    public long getCompletedActivities() {
        return completedActivities;
    }

    public void setCompletedActivities(long completedActivities) {
        this.completedActivities = completedActivities;
    }

    public List<Map<String, Object>> getLeadSources() {
        return leadSources;
    }

    public void setLeadSources(List<Map<String, Object>> leadSources) {
        this.leadSources = leadSources;
    }

    public List<Map<String, Object>> getLeadStatuses() {
        return leadStatuses;
    }

    public void setLeadStatuses(List<Map<String, Object>> leadStatuses) {
        this.leadStatuses = leadStatuses;
    }

    public List<Map<String, Object>> getPipelineByStatus() {
        return pipelineByStatus;
    }

    public void setPipelineByStatus(List<Map<String, Object>> pipelineByStatus) {
        this.pipelineByStatus = pipelineByStatus;
    }

    public List<Map<String, Object>> getCustomerStatuses() {
        return customerStatuses;
    }

    public void setCustomerStatuses(
            List<Map<String, Object>> customerStatuses) {
        this.customerStatuses = customerStatuses;
    }

    public List<Map<String, Object>> getActivityTypes() {
        return activityTypes;
    }

    public void setActivityTypes(
            List<Map<String, Object>> activityTypes) {
        this.activityTypes = activityTypes;
    }
}