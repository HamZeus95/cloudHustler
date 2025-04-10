package cloud.hustler.pidevbackend;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Ajouter la configuration pour autoriser toutes les origines
        registry.addMapping("/**")  // Applique à toutes les routes
                .allowedOrigins("*")  // Autoriser toutes les origines
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Méthodes autorisées
                .allowedHeaders("*") // Autoriser tous les headers
                .allowCredentials(false); // Ne pas autoriser les informations d'authentification
    }
}
