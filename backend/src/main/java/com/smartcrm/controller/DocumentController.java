package com.smartcrm.controller;

import com.smartcrm.entity.Document;
import com.smartcrm.service.DocumentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "http://localhost:5173")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @PostMapping("/upload")
    public ResponseEntity<Document> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("name") String name,
            @RequestParam("category") String category,
            @RequestParam(value = "description", required = false)
            String description,
            @RequestParam(value = "customerId", required = false)
            Long customerId,
            @RequestParam(value = "leadId", required = false)
            Long leadId,
            @RequestParam("uploadedBy") String uploadedBy
    ) throws IOException {

        Document document = documentService.uploadDocument(
                file,
                name,
                category,
                description,
                customerId,
                leadId,
                uploadedBy
        );

        return ResponseEntity.ok(document);
    }

    @GetMapping
    public ResponseEntity<List<Document>> getAllDocuments() {
        return ResponseEntity.ok(
                documentService.getAllDocuments()
        );
    }
}