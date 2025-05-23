package cloud.hustler.pidevbackend.config;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class GeminiConfig {
    @Value("${gemini.apit.url}")
    private String apiUrl;

    @Bean
    public WebClient geminiWebClient() {
        return WebClient.builder()
                .baseUrl(apiUrl)
                .defaultHeader("Content-Type", "application/json")
                .build();
    }
}
