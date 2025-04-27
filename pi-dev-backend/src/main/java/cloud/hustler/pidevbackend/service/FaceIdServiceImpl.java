// ── src/main/java/cloud/hustler/pidevbackend/service/FaceIdServiceImpl.java ──
package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.dto.FaceIdResponse;
import cloud.hustler.pidevbackend.entity.User;
import cloud.hustler.pidevbackend.repository.UserRepository;
import com.azure.ai.vision.face.FaceClient;
import com.azure.ai.vision.face.administration.FaceAdministrationClient;
import com.azure.ai.vision.face.administration.LargePersonGroupClient;
import com.azure.ai.vision.face.models.*;
import com.azure.core.util.BinaryData;
import com.azure.core.util.polling.SyncPoller;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class FaceIdServiceImpl implements IFaceIdService {

    private final FaceClient faceClient;
    private final FaceAdministrationClient faceAdminClient;
    private final UserRepository userRepository;

    @Value("${azure.face.recognition-model}")
    private String recognitionModel;

    private static final String PERSON_GROUP_ID = "users";

    /**
     * Get the currently authenticated user from Spring Security context
     * @return The current user or null if not authenticated
     */
    private User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        
        if (principal instanceof UserDetails) {
            String username = ((UserDetails) principal).getUsername();
            return userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        } else if (principal instanceof String) {
            String username = (String) principal;
            return userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        }
        
        throw new UsernameNotFoundException("Not authenticated");
    }

    @Override
    public FaceIdResponse registerFace(Principal principal, String imageBase64) {
        try {
            // Get user from principal
            User user;
            if (principal != null) {
                String email = principal.getName();
                user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found: " + email));
            } else {
                // Fallback to current security context if no principal provided
                user = getCurrentUser();
            }
            
            return registerFaceForUser(user, imageBase64);
        } catch (Exception ex) {
            log.error("registerFace error", ex);
            return FaceIdResponse.builder()
                .success(false)
                .message("Error: " + ex.getMessage())
                .build();
        }
    }
    
    @Override
    public FaceIdResponse registerFace(String userId, String imageBase64) {
        try {
            User user = userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
                
            return registerFaceForUser(user, imageBase64);
        } catch (Exception ex) {
            log.error("registerFace error", ex);
            return FaceIdResponse.builder()
                .success(false)
                .message("Error: " + ex.getMessage())
                .build();
        }
    }
    
    private FaceIdResponse registerFaceForUser(User user, String imageBase64) {
        try {
            // 1) Get or create the person group
            LargePersonGroupClient groupClient =
                faceAdminClient.getLargePersonGroupClient(PERSON_GROUP_ID);
            try {
                groupClient.create(
                    "Users",
                    /* userData= */ null,
                    FaceRecognitionModel.fromString(recognitionModel)
                );
                log.info("Created person group {}", PERSON_GROUP_ID);
            } catch (Exception ex) {
                log.debug("Person group '{}' already exists: {}", PERSON_GROUP_ID, ex.getMessage());
            }

            // 2) Create Person if needed
            String personId = user.getFaceId();
            if (personId == null || personId.isBlank()) {
                CreatePersonResult pr = groupClient.createPerson(
                    user.getEmail(),
                    /* userData= */ null
                );
                personId = pr.getPersonId().toString();
                user.setFaceId(personId);
                user.setFaceIdEnabled(true);
                userRepository.save(user);
            }

            // 3) Decode the image
            byte[] imageBytes = imageBase64.contains(",")
                ? Base64.getDecoder().decode(imageBase64.split(",",2)[1])
                : Base64.getDecoder().decode(imageBase64);

            // 4) Add face
            groupClient.addFace(
                personId,
                BinaryData.fromBytes(imageBytes)
            );
            log.info("Added face to person {}", personId);

            // 5) Train
            SyncPoller<BinaryData, BinaryData> poller = groupClient.beginTrain(null);
            poller.waitForCompletion();
            log.info("Training completed for group {}", PERSON_GROUP_ID);

            return FaceIdResponse.builder()
                .success(true)
                .message("Face registered")
                .faceId(personId)
                .build();
        } catch (Exception ex) {
            log.error("registerFaceForUser error", ex);
            return FaceIdResponse.builder()
                .success(false)
                .message("Error: " + ex.getMessage())
                .build();
        }
    }

    @Override
    public FaceIdResponse verifyFace(Principal principal, String imageBase64) {
        try {
            // Get user from principal
            User user;
            if (principal != null) {
                String email = principal.getName();
                user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found: " + email));
            } else {
                // Fallback to current security context
                user = getCurrentUser();
            }
            
            return verifyFaceForUser(user, imageBase64);
        } catch (Exception ex) {
            log.error("verifyFace error", ex);
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
            
            return verifyFaceForUser(user, imageBase64);
        } catch (Exception ex) {
            log.error("verifyFace error", ex);
            return FaceIdResponse.builder()
                .success(false)
                .message("Error: " + ex.getMessage())
                .build();
        }
    }
    
    private FaceIdResponse verifyFaceForUser(User user, String imageBase64) {
        try {
            if (!user.isFaceIdEnabled()) {
                return FaceIdResponse.builder()
                    .success(false)
                    .message("Face ID not enabled")
                    .build();
            }

            byte[] imageBytes = imageBase64.contains(",")
                ? Base64.getDecoder().decode(imageBase64.split(",",2)[1])
                : Base64.getDecoder().decode(imageBase64);

            // detect
            List<FaceDetectionResult> faces = faceClient.detect(
                BinaryData.fromBytes(imageBytes),
                FaceDetectionModel.DETECTION_03,
                FaceRecognitionModel.fromString(recognitionModel),
                true,
                List.of()
            );
            if (faces.isEmpty()) {
                return FaceIdResponse.builder()
                    .success(false)
                    .message("No face detected")
                    .build();
            }

            String detectedId = faces.get(0).getFaceId().toString();
            FaceVerificationResult vr = faceClient.verifyFromLargePersonGroup(
                detectedId,
                PERSON_GROUP_ID,
                user.getFaceId()
            );

            boolean ok = vr.isIdentical() && vr.getConfidence() >= 0.6;
            return FaceIdResponse.builder()
                .success(ok)
                .message(ok ? "Face verified" : "Face did not match")
                .faceId(ok ? user.getFaceId() : null)
                .build();
        } catch (Exception ex) {
            log.error("verifyFaceForUser error", ex);
            return FaceIdResponse.builder()
                .success(false)
                .message("Error: " + ex.getMessage())
                .build();
        }
    }

    @Override
    public FaceIdResponse verifyFaceByEmail(String email, String imageBase64) {
        return userRepository.findByEmail(email)
            .map(u -> verifyFaceForUser(u, imageBase64))
            .orElseGet(() -> FaceIdResponse.builder()
                .success(false)
                .message("User not found: " + email)
                .build());
    }

    @Override
    public FaceIdResponse disableFaceId(Principal principal) {
        try {
            // Get user from principal
            User user;
            if (principal != null) {
                String email = principal.getName();
                user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found: " + email));
            } else {
                // Fallback to current security context
                user = getCurrentUser();
            }
            
            return disableFaceIdForUser(user);
        } catch (Exception ex) {
            log.error("disableFaceId error", ex);
            return FaceIdResponse.builder()
                .success(false)
                .message("Error: " + ex.getMessage())
                .build();
        }
    }

    @Override
    public FaceIdResponse disableFaceId(String userId) {
        try {
            User user = userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
            
            return disableFaceIdForUser(user);
        } catch (Exception ex) {
            log.error("disableFaceId error", ex);
            return FaceIdResponse.builder()
                .success(false)
                .message("Error: " + ex.getMessage())
                .build();
        }
    }
    
    private FaceIdResponse disableFaceIdForUser(User user) {
        try {
            if (!user.isFaceIdEnabled()) {
                return FaceIdResponse.builder()
                    .success(true)
                    .message("Already disabled")
                    .build();
            }
            LargePersonGroupClient groupClient =
                faceAdminClient.getLargePersonGroupClient(PERSON_GROUP_ID);
            try {
                groupClient.deletePerson(user.getFaceId());
            } catch (Exception ignore) {
                log.warn("Could not delete person {}: {}", user.getFaceId(), ignore.getMessage());
            }
            user.setFaceId(null);
            user.setFaceIdEnabled(false);
            userRepository.save(user);

            return FaceIdResponse.builder()
                .success(true)
                .message("Face ID disabled")
                .build();
        } catch (Exception ex) {
            log.error("disableFaceIdForUser error", ex);
            return FaceIdResponse.builder()
                .success(false)
                .message("Error: " + ex.getMessage())
                .build();
        }
    }

    @Override
    public Optional<User> identifyUserByFaceOnly(String imageBase64) {
        try {
            log.info("Attempting to identify user by face only");
            
            // 1) Decode the image
            byte[] imageBytes = imageBase64.contains(",")
                ? Base64.getDecoder().decode(imageBase64.split(",", 2)[1])
                : Base64.getDecoder().decode(imageBase64);

            // 2) Detect face in the image
            List<FaceDetectionResult> detectedFaces = faceClient.detect(
                BinaryData.fromBytes(imageBytes),
                FaceDetectionModel.DETECTION_03,
                FaceRecognitionModel.fromString(recognitionModel),
                true,
                List.of()
            );
            
            if (detectedFaces.isEmpty()) {
                log.warn("No face detected in the image");
                return Optional.empty();
            }
            
            String detectedFaceId = detectedFaces.get(0).getFaceId().toString();
            log.info("Face detected with ID: {}", detectedFaceId);
            
            // 3) Find all users with face ID enabled
            List<User> usersWithFace = userRepository.findByFaceIdEnabled(true);
            log.info("Found {} users with Face ID enabled", usersWithFace.size());
            
            if (usersWithFace.isEmpty()) {
                log.warn("No users with Face ID enabled found in the system");
                return Optional.empty();
            }
            
            // 4) Try to verify the face against each registered user
            User matchedUser = null;
            double highestConfidence = 0.0;
            double minConfidenceThreshold = 0.6; // Minimum confidence to consider a match
            
            for (User user : usersWithFace) {
                if (user.getFaceId() == null || user.getFaceId().isEmpty()) {
                    continue;
                }
                
                try {
                    // Verify the detected face against this user's face ID
                    FaceVerificationResult result = faceClient.verifyFromLargePersonGroup(
                        detectedFaceId,
                        PERSON_GROUP_ID,
                        user.getFaceId()
                    );
                    
                    // If this is a match with higher confidence than previous matches
                    if (result.isIdentical() && result.getConfidence() >= minConfidenceThreshold && result.getConfidence() > highestConfidence) {
                        highestConfidence = result.getConfidence();
                        matchedUser = user;
                        log.info("Found potential match: {} with confidence: {}", user.getEmail(), result.getConfidence());
                    }
                } catch (Exception e) {
                    log.warn("Error verifying against user {}: {}", user.getEmail(), e.getMessage());
                    // Continue checking other users
                }
            }
            
            if (matchedUser != null) {
                log.info("Successfully identified user {} by face with confidence {}", matchedUser.getEmail(), highestConfidence);
                return Optional.of(matchedUser);
            } else {
                log.warn("No matching user found with sufficient confidence");
                return Optional.empty();
            }
            
        } catch (Exception ex) {
            log.error("Error during face-only identification", ex);
            return Optional.empty();
        }
    }
}
