package cloud.hustler.pidevbackend.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.io.File;
import java.util.HashMap;
import java.util.Map;
import java.util.List;

@Service
public class IaFarmService {
    private final WebClient webClient;

    private String huggingFaceApiKey = "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";
    private String geminiApiKey = "AIzaSyCP2mUaWi6vkWuGpTu0-YoYBynj1FQjgyQ";

    public IaFarmService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }
    //worked
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
    public Map<String, Object> predictYield(Map<String, Object> farmData) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=" + geminiApiKey;

        String prompt = String.format(
                "You are an agricultural expert. Based on the following farm data:\n\n" +
                        "- Crop type: %s\n" +
                        "- Field size: %s hectares\n" +
                        "- Planting date: %s\n" +
                        "- Soil type: %s\n" +
                        "- Recent weather: %s\n\n" +
                        "Please respond **in JSON format** like this:\n" +
                        "{\n" +
                        "  \"predictedYield\": \"[value in tons/hectare]\",\n" +
                        "  \"explanation\": \"[brief explanation of the yield prediction]\"\n" +
                        "}\n\n" +
                        "Only return valid JSON, without any extra text.",
                farmData.get("cropType"),
                farmData.get("fieldSize"),
                farmData.get("plantingDate"),
                farmData.get("soilType"),
                farmData.get("recentWeather")
        );

        Map<String, Object> requestBody = Map.of(
                "contents", new Object[] {
                        Map.of("parts", new Object[] {
                                Map.of("text", prompt)
                        })
                }
        );

        try {
            // Make the request and retrieve the response
            String response = webClient.post()
                    .uri(url)
                    .header("Content-Type", "application/json")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();  // Block to make the call synchronous

            // Parse the JSON part manually
            String jsonResponse = extractJsonFromResponse(response);
            return new ObjectMapper().readValue(jsonResponse, new TypeReference<Map<String, Object>>() {});
        } catch (Exception e) {
            throw new RuntimeException("Failed to predict yield: " + e.getMessage(), e);
        }
    }

    public Mono<String> predictFromImage(File imageFile) {
        String url = "https://agropule-ia.onrender.com/predict"; // change it if needed

        MultipartBodyBuilder bodyBuilder = new MultipartBodyBuilder();
        bodyBuilder.part("file", new FileSystemResource(imageFile));

        return webClient.post()
                .uri(url)
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .bodyValue(bodyBuilder.build())
                .retrieve()
                .bodyToMono(String.class);
    }



    //i dont know why i use them hhhhh
    private String extractJsonFromResponse(String geminiResponse) {
        // Extract the text from the response
        String text = extractText(geminiResponse);

        // Now clean the JSON from the Markdown formatting and parse it
        text = text.replaceAll("```json\\n", "").replaceAll("```", "").trim();

        // Return the clean JSON string
        return text;
    }

    private String extractText(String geminiResponse) {
        // Assuming the response has the structure you shared, extract the 'text' content
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, Object> responseMap = objectMapper.readValue(geminiResponse, new TypeReference<Map<String, Object>>() {});
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseMap.get("candidates");

            if (candidates != null && !candidates.isEmpty()) {
                Map<String, Object> candidate = candidates.get(0);
                Map<String, Object> content = (Map<String, Object>) candidate.get("content");
                List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");

                if (parts != null && !parts.isEmpty()) {
                    return (String) parts.get(0).get("text");
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to extract text from response: " + e.getMessage(), e);
        }
        throw new RuntimeException("Failed to find text in the response.");
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




    public Mono<String> getFarmResourceOptimization(Map<String, Object> resourceData) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=" + geminiApiKey;

        String prompt = "Analyze the following farm resource data and provide optimization recommendations:\n" +
                "- Water usage: " + resourceData.get("waterUsage") + "\n" +
                "- Fertilizer usage: " + resourceData.get("fertilizerUsage") + "\n" +
                "- Energy consumption: " + resourceData.get("energyConsumption") + "\n" +
                "- Labor hours: " + resourceData.get("laborHours") + "\n" +
                "- Crop type: " + resourceData.get("cropType") + "\n" +
                "- Field size: " + resourceData.get("fieldSize") + " hectares\n\n" +
                "Provide specific actionable recommendations to optimize resource usage while maintaining or improving yield.";

        Map<String, Object> requestBody = Map.of(
                "contents", new Object[] {
                        Map.of("parts", new Object[] {
                                Map.of("text", "You are a farm resource optimization expert. " + prompt)
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

    public Mono<String> get3DFarmData(Long farmId) {
        // In a real implementation, you would fetch this data from your database
        // This is a placeholder implementation that returns mock data

        Map<String, Object> mockFarmData = new HashMap<>();

        // Mock farm fields data
        List<Map<String, Object>> fields = List.of(
                Map.of(
                        "id", 1,
                        "name", "North Field",
                        "crop", "Corn",
                        "health", "Good",
                        "yieldForecast", "8.2 tons/ha",
                        "position", Map.of("x", -20, "z", -15),
                        "dimensions", Map.of("width", 15, "length", 10),
                        "healthStatus", 0.85
                ),
                Map.of(
                        "id", 2,
                        "name", "South Field",
                        "crop", "Wheat",
                        "health", "Fair",
                        "yieldForecast", "3.1 tons/ha",
                        "position", Map.of("x", 10, "z", 5),
                        "dimensions", Map.of("width", 20, "length", 12),
                        "healthStatus", 0.6
                ),
                Map.of(
                        "id", 3,
                        "name", "East Field",
                        "crop", "Soybeans",
                        "health", "Excellent",
                        "yieldForecast", "4.5 tons/ha",
                        "position", Map.of("x", 15, "z", -20),
                        "dimensions", Map.of("width", 18, "length", 14),
                        "healthStatus", 0.95
                )
        );

        // Mock farm buildings
        List<Map<String, Object>> buildings = List.of(
                Map.of(
                        "id", 1,
                        "type", "Farmhouse",
                        "position", Map.of("x", -30, "y", 0, "z", -30),
                        "dimensions", Map.of("width", 5, "height", 5, "length", 5)
                ),
                Map.of(
                        "id", 2,
                        "type", "Barn",
                        "position", Map.of("x", -25, "y", 0, "z", -20),
                        "dimensions", Map.of("width", 8, "height", 6, "length", 12)
                ),
                Map.of(
                        "id", 3,
                        "type", "Silo",
                        "position", Map.of("x", -20, "y", 0, "z", -25),
                        "dimensions", Map.of("width", 3, "height", 8, "length", 3)
                )
        );

        // Mock water sources
        List<Map<String, Object>> waterSources = List.of(
                Map.of(
                        "id", 1,
                        "type", "Pond",
                        "position", Map.of("x", 25, "y", 0, "z", -25),
                        "dimensions", Map.of("radius", 7)
                ),
                Map.of(
                        "id", 2,
                        "type", "Well",
                        "position", Map.of("x", -5, "y", 0, "z", -5),
                        "dimensions", Map.of("radius", 1)
                )
        );

        mockFarmData.put("farmId", farmId);
        mockFarmData.put("name", "Agropule Demo Farm");
        mockFarmData.put("fields", fields);
        mockFarmData.put("buildings", buildings);
        mockFarmData.put("waterSources", waterSources);

        // Convert to JSON string and return as Mono
        // In a real implementation, you would use a proper JSON serializer
        return Mono.just(mockFarmData.toString());
    }
}