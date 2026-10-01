package com.smartcrm.service;

import com.smartcrm.entity.Document;
import com.smartcrm.repository.DocumentRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.List;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;

    private final Path uploadDirectory =
            Paths.get("uploads/documents");

    public DocumentService(DocumentRepository documentRepository) {
        this.documentRepository = documentRepository;
    }

    public Document uploadDocument(
            MultipartFile file,
            String name,
            String category,
            String description,
            Long customerId,
            Long leadId,
            String uploadedBy
    ) throws IOException {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty");
        }

        Files.createDirectories(uploadDirectory);

        String originalFileName = file.getOriginalFilename();

        String extension = "";

        if (originalFileName != null && originalFileName.contains(".")) {
            extension = originalFileName.substring(
                    originalFileName.lastIndexOf(".")
            );
        }

        String storedFileName =
                UUID.randomUUID() + extension;

        Path filePath =
                uploadDirectory.resolve(storedFileName);

        Files.copy(
                file.getInputStream(),
                filePath,
                StandardCopyOption.REPLACE_EXISTING
        );

        Document document = new Document();

        document.setName(name);
        document.setOriginalFileName(originalFileName);
        document.setFileType(file.getContentType());
        document.setFileSize(file.getSize());
        document.setFilePath(filePath.toString());
        document.setCategory(category);
        document.setDescription(description);
        document.setCustomerId(customerId);
        document.setLeadId(leadId);
        document.setUploadedBy(uploadedBy);
        document.setUploadedAt(LocalDateTime.now());

        return documentRepository.save(document);
    }

    public List<Document> getAllDocuments() {
        return documentRepository.findAll();
    }
}