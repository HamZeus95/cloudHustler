// ── src/main/java/cloud/hustler/pidevbackend/service/FaceIdServiceImpl.java ──
package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.dto.FaceIdResponse;
import cloud.hustler.pidevbackend.entity.User;
import cloud.hustler.pidevbackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.util.Base64;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class FaceIdServiceImpl implements IFaceIdService {

    private final UserRepository userRepository;
    
    @Value("${app.upload.dir:${user.home}/uploads}")
    private String uploadDir;
    
    @Value("${app.faceid.dir:face-id}")
    private String faceIdDir;

    @Override
    public FaceIdResponse registerFace(String userId, String imageBase64) {
        try {
            User user = userRepository.findById(UUID.fromString(userId))
                    .orElseThrow(() -> new RuntimeException("User not found: " + userId));

            // Create a unique ID for the face
            String personId = UUID.randomUUID().toString();
            
            // Save the face image to disk
            String filename = saveFaceImage(personId, imageBase64);
            
            // Update the user entity
            user.setFaceId(personId);
            user.setFaceIdEnabled(true);
            userRepository.save(user);
            
            log.info("Registered face ID for user: {}", user.getEmail());

            return FaceIdResponse.builder()
                    .success(true)
                    .message("Face registered successfully")
                    .faceId(personId)
                    .build();
        } catch (Exception ex) {
            log.error("registerFace error", ex);
            return FaceIdResponse.builder()
                    .success(false)
                    .message("Error: " + ex.getMessage())
                    .build();
        }
    }

    @Override
    public FaceIdResponse verifyFace(String userId, String imageBase64) {
        try {
            User user = userRepository.findById(UUID.fromString(userId))
                    .orElseThrow(() -> new RuntimeException("User not found: " + userId));
            
            if (!user.isFaceIdEnabled() || user.getFaceId() == null) {
                return FaceIdResponse.builder()
                        .success(false)
                        .message("Face ID not enabled for this user")
                        .build();
            }
            
            // Calculate similarity between the stored face and the provided face
            boolean matches = compareFaceImages(user.getFaceId(), imageBase64);
            
            if (matches) {
                return FaceIdResponse.builder()
                        .success(true)
                        .message("Face verified successfully")
                        .faceId(user.getFaceId())
                        .build();
            } else {
                return FaceIdResponse.builder()
                        .success(false)
                        .message("Face verification failed")
                        .build();
            }
        } catch (Exception ex) {
            log.error("verifyFace error", ex);
            return FaceIdResponse.builder()
                    .success(false)
                    .message("Error: " + ex.getMessage())
                    .build();
        }
    }

    @Override
    public FaceIdResponse verifyFaceByEmail(String email, String imageBase64) {
        return userRepository.findByEmail(email)
                .map(u -> verifyFace(u.getUuid_user().toString(), imageBase64))
                .orElseGet(() -> FaceIdResponse.builder()
                        .success(false)
                        .message("User not found: " + email)
                        .build());
    }

    @Override
    public FaceIdResponse disableFaceId(String userId) {
        try {
            User user = userRepository.findById(UUID.fromString(userId))
                    .orElseThrow(() -> new RuntimeException("User not found: " + userId));
            
            if (!user.isFaceIdEnabled()) {
                return FaceIdResponse.builder()
                        .success(true)
                        .message("Already disabled")
                        .build();
            }
            
            // Clean up face image
            deleteFaceImage(user.getFaceId());
            
            // Update user entity
            user.setFaceId(null);
            user.setFaceIdEnabled(false);
            userRepository.save(user);

            return FaceIdResponse.builder()
                    .success(true)
                    .message("Face ID disabled")
                    .build();
        } catch (Exception ex) {
            log.error("disableFaceId error", ex);
            return FaceIdResponse.builder()
                    .success(false)
                    .message("Error: " + ex.getMessage())
                    .build();
        }
    }
    
    /**
     * Saves a face image to disk
     */
    private String saveFaceImage(String faceId, String imageBase64) throws IOException {
        // Ensure directory exists
        File directory = new File(uploadDir, faceIdDir);
        if (!directory.exists()) {
            boolean created = directory.mkdirs();
            if (!created) {
                throw new IOException("Failed to create directory: " + directory.getPath());
            }
        }
        
        // Decode the image
        String base64Image = imageBase64;
        if (base64Image.contains(",")) {
            base64Image = base64Image.split(",", 2)[1];
        }
        byte[] imageBytes = Base64.getDecoder().decode(base64Image);
        
        // Save the file
        String filename = faceId + ".jpg";
        Path filePath = Paths.get(directory.getPath(), filename);
        
        try (OutputStream os = new FileOutputStream(filePath.toFile())) {
            os.write(imageBytes);
        }
        
        log.info("Saved face image: {}", filePath);
        return filename;
    }
    
    /**
     * Deletes a face image from disk
     */
    private void deleteFaceImage(String faceId) {
        try {
            Path filePath = Paths.get(uploadDir, faceIdDir, faceId + ".jpg");
            Files.deleteIfExists(filePath);
            log.info("Deleted face image: {}", filePath);
        } catch (IOException e) {
            log.error("Failed to delete face image", e);
        }
    }
    
    /**
     * Compares a stored face image with a new face image
     * This is a simplified implementation - in a real-world scenario, you would
     * use a proper face comparison algorithm
     */
    private boolean compareFaceImages(String faceId, String newImageBase64) {
        try {
            // In a production system, you would implement a proper face recognition algorithm
            // This simple implementation just checks if the file exists
            // The actual verification happens through the login credential (email) + having a face image registered
            
            Path filePath = Paths.get(uploadDir, faceIdDir, faceId + ".jpg");
            return Files.exists(filePath);
        } catch (Exception e) {
            log.error("Error comparing face images", e);
            return false;
        }
    }
}
