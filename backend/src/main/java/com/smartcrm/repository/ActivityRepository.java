package com.smartcrm.repository;

import com.smartcrm.entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ActivityRepository extends JpaRepository<Activity, Long> {

    long countByStatus(String status);

    // =========================
    // ACTIVITY STATUS
    // =========================

    @Query("""
        SELECT a.status, COUNT(a)
        FROM Activity a
        GROUP BY a.status
        ORDER BY COUNT(a) DESC
    """)
    List<Object[]> getActivityStatuses();

    // =========================
    // ACTIVITY TYPE
    // =========================

    @Query("""
        SELECT a.type, COUNT(a)
        FROM Activity a
        GROUP BY a.type
        ORDER BY COUNT(a) DESC
    """)
    List<Object[]> getActivityTypes();
}