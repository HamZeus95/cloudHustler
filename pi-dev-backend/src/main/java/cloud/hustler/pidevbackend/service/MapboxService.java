package cloud.hustler.pidevbackend.service;

import lombok.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;

@Service
public class MapboxService {

    private String apiKey ="pk.eyJ1IjoibG91YXloMTEiLCJhIjoiY205cHFoejNqMGt6MjJqczRlN3JxYjl6aiJ9.r_vwTnPHgJfRZoE-YRKtNA";

    public String geocodeAddress(String address) throws IOException, InterruptedException {
        String url = "https://api.mapbox.com/geocoding/v5/mapbox.places/"
                + URLEncoder.encode(address, StandardCharsets.UTF_8)
                + ".json?access_token=" + apiKey;

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        return response.body(); // Retourne un JSON avec les coordonnées.
    }
}