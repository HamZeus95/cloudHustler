package cloud.hustler.pidevbackend.config;

import com.azure.ai.vision.face.FaceClient;
import com.azure.ai.vision.face.FaceClientBuilder;
import com.azure.ai.vision.face.administration.FaceAdministrationClient;
import com.azure.ai.vision.face.administration.FaceAdministrationClientBuilder;
import com.azure.core.credential.AzureKeyCredential;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AzureFaceConfig {

    @Value("${azure.face.endpoint}")
    private String azureEndpoint;
    
    @Value("${azure.face.key}")
    private String azureKey;
    
    @Value("${azure.face.recognition-model}")
    private String recognitionModel;

    @Bean
    public FaceClient faceClient() {
        return new FaceClientBuilder()
            .endpoint(azureEndpoint)
            .credential(new AzureKeyCredential(azureKey))
            .buildClient();
    }

    @Bean
    public FaceAdministrationClient faceAdministrationClient() {
        return new FaceAdministrationClientBuilder()
            .endpoint(azureEndpoint)
            .credential(new AzureKeyCredential(azureKey))
            .buildClient();
    }
}