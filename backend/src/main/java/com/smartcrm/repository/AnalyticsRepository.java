package com.smartcrm.repository;

import com.smartcrm.entity.Lead;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AnalyticsRepository extends JpaRepository<Lead, Long> {

    // =========================
    // LEAD ANALYTICS
    // =========================

    @Query("""
        SELECT l.source, COUNT(l)
        FROM Lead l
        GROUP BY l.source
        ORDER BY COUNT(l) DESC
    """)
    List<Object[]> getLeadSources();

    @Query("""
        SELECT l.status, COUNT(l)
        FROM Lead l
        GROUP BY l.status
        ORDER BY COUNT(l) DESC
    """)
    List<Object[]> getLeadStatuses();

    @Query("""
        SELECT l.status, COALESCE(SUM(l.value), 0)
        FROM Lead l
        GROUP BY l.status
        ORDER BY SUM(l.value) DESC
    """)
    List<Object[]> getPipelineByStatus();

    // =========================
    // CUSTOMER ANALYTICS
    // =========================

    @Query("""
        SELECT c.status, COUNT(c)
        FROM Customer c
        GROUP BY c.status
        ORDER BY COUNT(c) DESC
    """)
    List<Object[]> getCustomerStatuses();
}