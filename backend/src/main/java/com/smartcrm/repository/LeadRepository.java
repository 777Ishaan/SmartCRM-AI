package com.smartcrm.repository;

import com.smartcrm.entity.Lead;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface LeadRepository extends JpaRepository<Lead, Long> {

    @Query("SELECT COALESCE(SUM(l.value), 0) FROM Lead l")
    Double getTotalPipelineValue();
}