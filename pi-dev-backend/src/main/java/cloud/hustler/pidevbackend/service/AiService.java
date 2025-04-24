package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.entity.Livraison;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Comparator;

import static org.aspectj.bridge.MessageUtil.print;

@Slf4j
@Service
public class AiService {

    private final RestTemplate restTemplate;

    @Value("${huggingface.api.url}")
    private String apiUrl;

    @Value("${huggingface.api.key}")
    private String apiKey;

    private static final String mapboxGeocodingUrl = "https://api.mapbox.com/geocoding/v5/mapbox.places/";


    public AiService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public boolean predictDelay(Livraison livraison) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        String prompt = String.format(
                "Analysez ces données de livraison :\n" +
                        "- Adresse: %s\n" +
                        "- Date prévue: %s\n" +
                        "- Date création: %s\n" +
                        "- Statut: %s\n" +
                        "Cette livraison sera-t-elle en retard ? Répondez par 'oui' ou 'non'.",
                livraison.getAdresseLivraison(),
                livraison.getDateLivraison(),
                livraison.getDateCreation(),
                livraison.getStatut()
        );

        Map<String, Object> requestBody = Map.of(
                "inputs", prompt,
                "parameters", Map.of(
                        "candidate_labels", new String[]{"en retard", "à l'heure"}
                )
        );

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    apiUrl,
                    request,
                    Map.class
            );

            if (response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();
                if (responseBody != null && responseBody.containsKey("labels")) {
                    var labels = (java.util.List<String>) responseBody.get("labels");
                    // On suppose que le premier label est celui avec le score le plus élevé
                    String topPrediction = labels.get(0).toLowerCase();
                    return topPrediction.contains("retard");
                }
            }
            return false;
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de l'appel à l'API HuggingFace", e);
        }
    }
    @Value("${mapbox.api.url}")
    private String mapboxApiUrl;

    @Value("${mapbox.api.key}")
    private String mapboxApiKey;



    public int calculateEta(Livraison livraison) {
        try {
            // 1. Obtenir les coordonnées
            String origin = livraison.getDeliveryDriver().getPositionLivreur();; // Point de départ fixe
            String destination = getTunisianCoordinates(livraison.getAdresseLivraison());
            System.out.println(destination);
            // 2. Construire l'URL avec les coordonnées validées
            String url = String.format("%s/directions/v5/mapbox/driving/%s;%s?access_token=%s",
                    mapboxApiUrl, origin, destination, mapboxApiKey);

            // 3. Appel à l'API
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            Map<String, Object> body = response.getBody();

            // 4. Traitement de la réponse
            if (body == null || !body.containsKey("routes")) {
                throw new RuntimeException("Invalid response from Mapbox API");
            }

            List<Map<String, Object>> routes = (List<Map<String, Object>>) body.get("routes");
            if (routes.isEmpty()) {
                throw new RuntimeException("No routes found");
            }

            Number duration = (Number) routes.get(0).get("duration");
            if (duration == null) {
                throw new RuntimeException("No duration in route");
            }

            // Conversion en minutes (arrondi supérieur)
            return (int) Math.ceil(duration.doubleValue() / 60);
        } catch (Exception e) {
            throw new RuntimeException("Failed to calculate ETA: " + e.getMessage(), e);
        }
    }
    private String getTunisianCoordinates(String address) {
        try {
            String fullAddress = address + ", Tunisie";
            String encodedAddress = URLEncoder.encode(fullAddress, StandardCharsets.UTF_8);

            // 1. Essai avec restriction pays
            String url = String.format("%s%s.json?access_token=%s&country=tn&limit=1",
                    mapboxGeocodingUrl, encodedAddress, mapboxApiKey);

            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            Map<String, Object> bestResult = validateResponse(response, address);

            return formatCoordinates(bestResult);

        } catch (Exception e) {
            // Fallback avec bounding box si premier échec
            String encodedAddress = URLEncoder.encode(address, StandardCharsets.UTF_8);
            String url = String.format("%s%s.json?access_token=%s&bbox=7.5,30.2,11.6,37.5&limit=1",
                    mapboxGeocodingUrl, encodedAddress, mapboxApiKey);

            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            Map<String, Object> bestResult = validateResponse(response, address);

            return formatCoordinates(bestResult);
        }
    }

    private Map<String, Object> validateResponse(ResponseEntity<Map> response, String address) {
        List<Map<String, Object>> features = (List<Map<String, Object>>) response.getBody().get("features");
        if (features == null || features.isEmpty()) {
            throw new RuntimeException("Aucun résultat pour: " + address);
        }

        Map<String, Object> result = features.get(0);
        String placeName = ((String) result.get("place_name")).toLowerCase();

        if (!placeName.contains("tunis") && !placeName.contains("tunisia")) {
            throw new RuntimeException("Résultat hors Tunisie: " + placeName);
        }

        return result;
    }

    private String formatCoordinates(Map<String, Object> feature) {
        List<?> coords = (List<?>) ((Map<String, Object>) feature.get("geometry")).get("coordinates");
        double longitude = ((Number) coords.get(0)).doubleValue();
        double latitude = ((Number) coords.get(1)).doubleValue();
        return String.format(Locale.US, "%.6f,%.6f", longitude, latitude);
    }
}