package cloud.hustler.pidevbackend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig {
    
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // IMPORTANT: When using setAllowCredentials(true), we cannot use '*' for setAllowedOrigins
        // We must explicitly list all allowed origins
        List<String> allowedOrigins = Arrays.asList(
            "http://localhost:4200",          // Dev
            "http://127.0.0.1:4200"           // Dev alternative
            // Add your production URLs here when deploying
        );
        
        // Use setAllowedOriginPatterns instead of setAllowedOrigins for specific origins when allowCredentials=true
        config.setAllowedOriginPatterns(allowedOrigins);
        
        // Allow all HTTP methods
        config.addAllowedMethod("*");
        
        // Allow all headers
        config.addAllowedHeader("*");
        
        // Allow credentials (cookies, authorization headers, etc)
        config.setAllowCredentials(true);
        
        // Set exposed headers to allow the frontend to access them
        config.setExposedHeaders(Arrays.asList(
            "Authorization", 
            "Content-Type", 
            "Access-Control-Allow-Origin",
            "Access-Control-Allow-Credentials"
        ));
        
        // Set max age to reduce preflight requests (1 hour)
        config.setMaxAge(3600L);
        
        // Apply this configuration to all paths
        source.registerCorsConfiguration("/**", config);
        source.registerCorsConfiguration("/api/v1/auth/**", config);
        
        return new CorsFilter(source);
    }
}