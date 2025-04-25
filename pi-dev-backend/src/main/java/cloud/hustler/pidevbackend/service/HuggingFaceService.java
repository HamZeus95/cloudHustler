package cloud.hustler.pidevbackend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode; // Jackson pour parser le JSON

@Service
public class HuggingFaceService {

    private static final String API_URL = "https://api-inference.huggingface.co/models/google/flan-t5-large";

    private static final String API_TOKEN = "Bearer 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"; // Remplacez par votre jeton

    public String generateDescription(String eventTitle, String location, String startDate) {
        if (eventTitle == null || location == null || startDate == null) {
            return "Les informations de l'événement sont incomplètes.";
        }

        try {
            String prompt = String.format(
                    "Write a professional, inspiring, and engaging description for an environmental awareness event titled \"%s\" taking place in \"%s\" on \"%s\". " +
                            "The event focuses on promoting environmental consciousness and includes activities like tree planting, waste collection, and nature workshops. " +
                            "Participants include volunteers, students, and members of ecological organizations. " +
                            "The tone should be friendly and educational. Encourage people to join this meaningful cause and make a positive impact on the planet. " +
                            "End the description with an inviting call-to-action that motivates people to attend.",
                    eventTitle,
                    location,
                    startDate
            );



            // Création du corps de la requête avec Jackson
            ObjectMapper mapper = new ObjectMapper();
            ObjectNode requestBody = mapper.createObjectNode();
            requestBody.put("inputs", prompt);
            ObjectNode parameters = mapper.createObjectNode();
            parameters.put("max_length", 300);
            requestBody.set("parameters", parameters);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", API_TOKEN);

            HttpEntity<String> entity = new HttpEntity<>(mapper.writeValueAsString(requestBody), headers);
            RestTemplate restTemplate = new RestTemplate();

            ResponseEntity<String> response = restTemplate.exchange(API_URL, HttpMethod.POST, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                return extractDescriptionFromResponse(response.getBody());
            } else {
                return "Erreur : échec de la génération de la description.";
            }

        } catch (Exception e) {
            return "Erreur interne lors de la génération de la description : " + e.getMessage();
        }
    }


    private String extractDescriptionFromResponse(String responseBody) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode root = objectMapper.readTree(responseBody);
            if (root.isArray() && root.size() > 0) {
                return root.get(0).get("generated_text").asText();
            } else {
                return "Réponse inattendue de l'API.";
            }
        } catch (Exception e) {
            return "Erreur de parsing de la réponse.";
        }
    }

}
