package com.smartcrm.service;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import org.springframework.stereotype.Service;

@Service
public class GeminiAiService implements AiService {

    private final Client geminiClient;

    public GeminiAiService(Client geminiClient) {
        this.geminiClient = geminiClient;
    }

    @Override
    public String chat(String message) {

        GenerateContentResponse response =
                geminiClient.models.generateContent(
                        "gemini-2.5-flash",
                        message,
                        null
                );

        return response.text();
    }
}