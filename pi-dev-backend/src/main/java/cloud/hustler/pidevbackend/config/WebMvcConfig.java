package cloud.hustler.pidevbackend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    
    @Value("${app.upload.dir:${user.dir}/src/main/resources/static/images}")
    private String uploadDir;
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // We need to explicitly register resource handlers due to the custom context path
        System.out.println("Images will be served from the static resources directory: " + uploadDir);
        
        // Create directory if it doesn't exist
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            boolean created = directory.mkdirs();
            if (created) {
                System.out.println("Created upload directory: " + directory.getAbsolutePath());
            }
        }

        // Create the file URL to serve from the physical path
        String imageFilePath = "file:" + uploadDir + "/";
        System.out.println("Image file path for resource handler: " + imageFilePath);
        
        // 1. Register handler for direct access to images (bypassing context path)
        registry.addResourceHandler("/images/**")
                .addResourceLocations(imageFilePath)
                .setCachePeriod(3600);
                
        // 2. Register handler for accessing images through the API context path
        registry.addResourceHandler("/api/v1/images/**")
                .addResourceLocations(imageFilePath)
                .setCachePeriod(3600);
    }
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:4200")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}