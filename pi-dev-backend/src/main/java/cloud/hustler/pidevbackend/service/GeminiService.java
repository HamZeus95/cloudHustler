package cloud.hustler.pidevbackend.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@Service
public class GeminiService {
    private final WebClient webClient;
    private final String apiKey;  // Add this field

    @Autowired
    public GeminiService(WebClient geminiWebClient, @Value("${gemini.apit.key}") String apiKey) {
        this.webClient = geminiWebClient;
        this.apiKey = apiKey;
    }

    public Mono<String> generateText(String prompt) {
        Map<String, Object> requestBody = Map.of(
                "contents", List.of(Map.of(
                                "parts", List.of(Map.of("text", prompt))
                        )));


        return webClient.post()
                .uri("?key=" + apiKey)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .map(response -> {
                    // Proper response parsing with type safety
                    try {
                        List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
                        Map<String, Object> firstCandidate = candidates.get(0);
                        Map<String, Object> content = (Map<String, Object>) firstCandidate.get("content");
                        List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                        Map<String, Object> firstPart = parts.get(0);
                        return firstPart.get("text").toString();
                    } catch (Exception e) {
                        throw new RuntimeException("Failed to parse Gemini response", e);
                    }
                });
    }
}