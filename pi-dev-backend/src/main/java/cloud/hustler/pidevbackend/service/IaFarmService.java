package cloud.hustler.pidevbackend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

@Service
public class IaFarmService {

    private final WebClient webClient;


    private String huggingFaceApiKey="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";

    private String geminiApiKey="AIzaSyCP2mUaWi6vkWuGpTu0-YoYBynj1FQjgyQ";

    public IaFarmService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public Mono<String> recommendCrop(Map<String, Object> input) {
        return webClient.post()
                .uri("https://api-inference.huggingface.co/models/Novadotgg/Crop-recommendation")
                .header("Authorization", "Bearer " + huggingFaceApiKey)
                .header("Content-Type", "application/json")
                .bodyValue(input)
                .retrieve()
                .bodyToMono(String.class);
    }

    public Mono<String> askFarmingQuestion(String prompt) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=" + geminiApiKey;

        Map<String, Object> requestBody = Map.of(
                "contents", new Object[] {
                        Map.of("parts", new Object[] {
                                Map.of("text", "You are a farming expert. Answer only farming questions. " + prompt)
                        })
                }
        );

        return webClient.post()
                .uri(url)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class);
    }
}