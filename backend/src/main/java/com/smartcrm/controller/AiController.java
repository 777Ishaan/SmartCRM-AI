package com.smartcrm.controller;

import com.smartcrm.dto.AiChatRequest;
import com.smartcrm.dto.AiChatResponse;
import com.smartcrm.service.AiService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/chat")
    public AiChatResponse chat(
            @RequestBody AiChatRequest request
    ) {

        String response =
                aiService.chat(request.getMessage());

        return new AiChatResponse(response);
    }
}