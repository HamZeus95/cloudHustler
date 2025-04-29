package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.entity.Livraison;
import cloud.hustler.pidevbackend.entity.Order;
import cloud.hustler.pidevbackend.entity.OrderItem;
import cloud.hustler.pidevbackend.entity.Product;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

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
    @Value("${gemini.api.keyliv}")
    private String apiKeyge;

    @Value("${gemini.api.urlliv}")
    private String apiUrlge;
    @Value("${gemini.model.name}")
    private String geminiModelName;


    public List<Livraison> reorderLivraisonsWithAI(List<Livraison> livraisons) {
        if (livraisons == null || livraisons.isEmpty()) {
            return Collections.emptyList();
        }
        System.out.println(apiUrlge + "?key=" + apiKeyge);


        try {
            // 1. Construire une liste des produits par livraison avec plus de détails
            List<String> descriptionProduits = new ArrayList<>();
            for (int i = 0; i < livraisons.size(); i++) {
                Livraison livraison = livraisons.get(i);
                Order order = livraison.getOrder();
                StringJoiner produits = new StringJoiner(", ");

                for (OrderItem item : order.getOrderItems()) {
                    produits.add(item.getProduct().getName());
                }

                descriptionProduits.add(String.format("%d. Livraison ID: %d | Produits: %s | Client: %s",
                        i + 1,
                        livraison.getId(),
                        produits.toString(),
                        order.getConsumer().getUsername()));
            }

            // 2. Créer un prompt plus structuré avec des exemples
            StringBuilder prompt = new StringBuilder();
            prompt.append("Vous êtes un assistant pour un service de livraison. Voici la liste des livraisons à trier par ordre de priorité :\n\n");

            for (String desc : descriptionProduits) {
                prompt.append("- ").append(desc).append("\n");
            }

            prompt.append("\nRègles de priorité STRICTES :\n");
            prompt.append("1. EXTREME URGENCE : Produits très périssables (bananes, poissons, fruits de mer, viandes fraîches)\n");
            prompt.append("2. URGENCE : Légumes frais (tomates, salades, herbes)\n");
            prompt.append("3. MOYENNE : Produits laitiers, œufs, produits emballés\n");
            prompt.append("4. FAIBLE : Produits secs (riz, pâtes), conserves\n");
            prompt.append("5. NON ALIMENTAIRE : Meubles, électroménager, livres\n\n");

            prompt.append("Instructions :\n");
            prompt.append("- Si une livraison contient plusieurs produits, utiliser la catégorie la plus urgente\n");
            prompt.append("- En cas d'égalité, prioriser les livraisons avec le plus de produits périssables\n");
            prompt.append("- Ne pas tenir compte des quantités\n");
            prompt.append("- Répondre EXACTEMENT dans ce format : \"Résultat : [n°1,n°2,n°3,...]\"\n");
            prompt.append("Exemple : \"Résultat : [3,1,2]\"\n");

            // 3. Configuration de la requête
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
           // headers.setBearerAuth(apiKeyge);

            Map<String, Object> requestBody = Map.of(
                    "contents", List.of(
                            Map.of("parts", List.of(
                                    Map.of("text", prompt.toString())
                            ))
                    ),
                    "generationConfig", Map.of(
                            "temperature", 0.2,  // Pour des réponses plus déterministes
                            "topK", 1
                    )
            );

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            // 4. Appel à l'API Gemini avec timeout
            String urlWithKey = apiUrlge + "?key=" + apiKeyge;
            ResponseEntity<Map> response = restTemplate.exchange(
                    urlWithKey,
                    HttpMethod.POST,
                    entity,
                    Map.class
            );
            System.out.println(urlWithKey);
            // 5. Traitement robuste de la réponse
            String responseText = extractResponseText(response.getBody());

            // 6. Parsing strict de la réponse
            List<Integer> order = parseStrictOrder(responseText, livraisons.size());
            log.info("Prompt sent to Gemini:\n{}", prompt.toString());

            // ... existing code ...

            // Log the raw response
            log.info("Raw response from Gemini:\n{}", responseText);

            // Log the parsed order
            log.info("Parsed order from Gemini:\n{}", order);

            // Log the original list
            // Log the original list
            log.info("Original list of livraisons:\n{}", livraisons.stream().map(Livraison::getId).collect(Collectors.toList()));

            // 7. Reconstruction de la liste ordonnée
            List<Livraison> reorderedLivraisons = order.stream()
                    .map(index -> livraisons.get(index - 1))
                    .collect(Collectors.toList());

            // Log the reordered list
            log.info("Reordered list of livraisons:\n{}", reorderedLivraisons.stream().map(Livraison::getId).collect(Collectors.toList()));            // 7. Reconstruction de la liste ordonnée
            return order.stream()
                    .map(index -> livraisons.get(index - 1))
                    .collect(Collectors.toList());


        } catch (Exception e) {
            // Fallback : tri local si l'IA échoue
            log.warn("Erreur avec Gemini, utilisation du tri local de secours", e);
            return orderLivraisonsByPriorityFallback(livraisons);
        }

    }

// Méthodes helper améliorées

    private String extractResponseText(Map<String, Object> body) {
        if (body == null) {
            throw new RuntimeException("Réponse vide de l'API Gemini");
        }

        try {
            return ((List<Map<String, Object>>) body.get("candidates")).stream()
                    .findFirst()
                    .map(candidate -> (Map<String, Object>) candidate.get("content"))
                    .map(content -> (List<Map<String, Object>>) content.get("parts"))
                    .flatMap(parts -> parts.stream().findFirst())
                    .map(part -> (String) part.get("text"))
                    .orElseThrow(() -> new RuntimeException("Format de réponse inattendu"));
        } catch (ClassCastException e) {
            throw new RuntimeException("Erreur de parsing de la réponse Gemini", e);
        }
    }

    private List<Integer> parseStrictOrder(String text, int maxSize) {
        // Recherche du pattern strict [x,y,z]
        Pattern pattern = Pattern.compile("Résultat\\s*:\\s*\\[([\\d,]+)\\]");
        Matcher matcher = pattern.matcher(text);

        if (!matcher.find()) {
            throw new RuntimeException("Format de réponse invalide - motif non trouvé");
        }

        String numbers = matcher.group(1);
        List<Integer> result = Arrays.stream(numbers.split(","))
                .map(String::trim)
                .map(Integer::parseInt)
                .collect(Collectors.toList());

        // Validation des numéros
        for (int num : result) {
            if (num < 1 || num > maxSize) {
                throw new RuntimeException("Numéro de livraison invalide: " + num);
            }
        }

        // Vérification des doublons
        if (result.size() != new HashSet<>(result).size()) {
            throw new RuntimeException("Doublons détectés dans la réponse");
        }

        return result;
    }

    // Méthode de fallback locale
    private List<Livraison> orderLivraisonsByPriorityFallback(List<Livraison> livraisons) {
        return livraisons.stream()
                .sorted(Comparator.comparingInt(this::calculatePriorityScore))
                .collect(Collectors.toList());
    }

    private int calculatePriorityScore(Livraison livraison) {
        return livraison.getOrder().getOrderItems().stream()
                .mapToInt(item -> getProductPriorityLevel(item.getProduct()))
                .min()
                .orElse(Integer.MAX_VALUE);
    }

    private int getProductPriorityLevel(Product product) {
        String name = product.getName().toLowerCase();

        if (name.matches(".*(banane|poisson|fruit de mer|viande fraîche|crustacé).*")) {
            return 1;
        } else if (name.matches(".*(tomate|salade|herbe|legume|fraîche).*")) {
            return 2;
        } else if (name.matches(".*(lait|yaourt|fromage|œuf|oeuf).*")) {
            return 3;
        } else if (name.matches(".*(riz|pâte|conserve|sec).*")) {
            return 4;
        } else {
            return 5;
        }
    }

}