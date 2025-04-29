package cloud.hustler.pidevbackend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;

import static cloud.hustler.pidevbackend.controllers.PostController.UPLOAD_DIR;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Value("${app.upload.dir:${user.dir}/src/main/resources/static/images}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Create directory if it doesn't exist
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        // Register handler for product images
        registry.addResourceHandler("/product/images/**")
                .addResourceLocations("file:" + uploadDir + "/")
                .setCachePeriod(3600);
        registry.addResourceHandler("/pi-dev-backend/uploads/**")
                .addResourceLocations("file:" + UPLOAD_DIR)
                .setCachePeriod(0);
    }




}