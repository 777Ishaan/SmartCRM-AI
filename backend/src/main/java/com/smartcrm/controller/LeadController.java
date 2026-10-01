package com.smartcrm.controller;

import com.smartcrm.entity.Lead;
import com.smartcrm.repository.LeadRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leads")
@CrossOrigin(origins = "http://localhost:5173")
public class LeadController {

    private final LeadRepository leadRepository;

    public LeadController(LeadRepository leadRepository) {
        this.leadRepository = leadRepository;
    }

    // GET ALL LEADS
    @GetMapping
    public List<Lead> getAllLeads() {
        return leadRepository.findAll();
    }

    // GET LEAD BY ID
    @GetMapping("/{id}")
    public Lead getLeadById(@PathVariable Long id) {
        return leadRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Lead not found with id: " + id)
                );
    }

    // CREATE LEAD
    @PostMapping
    public Lead createLead(@RequestBody Lead lead) {
        return leadRepository.save(lead);
    }

    // UPDATE LEAD
    @PutMapping("/{id}")
    public Lead updateLead(
            @PathVariable Long id,
            @RequestBody Lead updatedLead
    ) {

        Lead lead = leadRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Lead not found with id: " + id)
                );

        lead.setName(updatedLead.getName());
        lead.setCompany(updatedLead.getCompany());
        lead.setEmail(updatedLead.getEmail());
        lead.setPhone(updatedLead.getPhone());
        lead.setSource(updatedLead.getSource());
        lead.setStatus(updatedLead.getStatus());
        lead.setValue(updatedLead.getValue());
        lead.setAssignedTo(updatedLead.getAssignedTo());
        lead.setNotes(updatedLead.getNotes());

        return leadRepository.save(lead);
    }

    // DELETE LEAD
    @DeleteMapping("/{id}")
    public void deleteLead(@PathVariable Long id) {

        if (!leadRepository.existsById(id)) {
            throw new RuntimeException(
                    "Lead not found with id: " + id
            );
        }

        leadRepository.deleteById(id);
    }
}