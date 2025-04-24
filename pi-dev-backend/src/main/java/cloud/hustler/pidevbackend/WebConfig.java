package cloud.hustler.pidevbackend;


import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Utilisation d'un chemin absolu pour le dossier uploads
        String uploadDir = "file:///C:/Users/ons26/cloudhustler/cloudHustler/uploads/";  // Chemin absolu complet

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(uploadDir);

        // Log du chemin pour déboguer
        System.out.println("Chemin d'upload configuré : " + uploadDir);


    }
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Applique CORS à toutes les routes
                .allowedOrigins("http://localhost:4200") // Autoriser les requêtes venant de ce frontend
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH") // Autoriser ces méthodes
                .allowedHeaders("Content-Type", "Authorization");
        // Autoriser tous les header
    }
}

