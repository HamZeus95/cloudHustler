package cloud.hustler.pidevbackend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class ChatbotService {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    private final RestTemplate restTemplate;

    public ChatbotService(RestTemplateBuilder restTemplateBuilder) {
        this.restTemplate = restTemplateBuilder.build();
    }

    public String processMessage(String userMessage) {
        try {
            // Prepare headers
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + geminiApiKey);
            headers.set("Content-Type", "application/json");

            // Prepare request body (adjust based on Gemini API documentation)
            String requestBody = String.format("{\"contents\": [{\"parts\": [{\"text\": \"%s\"}]}], \"model\": \"gemini-pro\"}", userMessage);

            // Create HTTP entity
            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

            // Make API call
            ResponseEntity<String> response = restTemplate.exchange(
                    geminiApiUrl,
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            // Return response (simplified; parse JSON based on actual Gemini response)
            return response.getBody();
        } catch (Exception e) {
            return "Error processing message: " + e.getMessage();
        }
    }
}