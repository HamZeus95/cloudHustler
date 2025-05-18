package cloud.hustler.pidevbackend.controllers;

import cloud.hustler.pidevbackend.dto.*;
import cloud.hustler.pidevbackend.entity.User;
import cloud.hustler.pidevbackend.repository.UserRepository;
import cloud.hustler.pidevbackend.service.IFaceIdService;
import cloud.hustler.pidevbackend.service.auth.IJwtService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.TimeZone;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/face-id")
@RequiredArgsConstructor
@Slf4j
public class FaceIdController {

    private final IFaceIdService faceIdService;
    private final UserRepository userRepository;
    private final IJwtService jwtService;
    
    @Value("${application.security.jwt.refresh-token.expiration}")
    private long refreshExpiration;

    @PostMapping("/register")
    public ResponseEntity<?> registerFace(@RequestBody FaceIdRegisterRequest request, Principal principal) {
        try {
            if (principal == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                        "success", false,
                        "message", "Authentication required for face registration"
                    ));
            }
            
            // Use the authenticated principal directly - the service will extract the user
            FaceIdResponse response = faceIdService.registerFace(principal, request.getImageBase64());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error registering face: {}", e.getMessage(), e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to register face: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyFace(@RequestBody FaceIdLoginRequest request, Principal principal) {
        try {
            FaceIdResponse response;
            // If email is provided, use it for verification
            if (request.getEmail() != null && !request.getEmail().isEmpty()) {
                response = faceIdService.verifyFaceByEmail(
                    request.getEmail(),
                    request.getImageBase64()
                );
            } else if (principal != null) {
                // Otherwise use the authenticated user
                response = faceIdService.verifyFace(principal, request.getImageBase64());
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                        "success", false, 
                        "message", "Email required when not authenticated"
                    ));
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error verifying face: {}", e.getMessage(), e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to verify face: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }    @PostMapping("/login-with-face-only")
    public ResponseEntity<?> loginWithFaceOnly(@RequestBody Map<String, String> request, HttpServletResponse response) {
        try {
            String imageBase64 = request.get("imageBase64");
            if (imageBase64 == null || imageBase64.isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Face image is required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
            }
            
            // Attempt to identify user by face only
            Optional<User> userOptional = faceIdService.identifyUserByFaceOnly(imageBase64);
            
            if (userOptional.isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Face not recognized. Please try again or use email/password login.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
            }
            
            User user = userOptional.get();
            log.info("User identified by face: {}", user.getEmail());
            
            // Generate JWT for authenticated user
            var accessToken = jwtService.generateToken(user);
            var refreshToken = jwtService.generateRefreshToken(user);
            
            // Set the refresh token in an HttpOnly cookie
            addRefreshTokenCookie(response, refreshToken);
            
            // Create user response DTO
            UserResponse userResponse = mapToUserResponse(user);
            
            // Return the auth response without the refresh token in the JSON body
            return ResponseEntity.ok(AuthenticationResponse.builder()
                    .accessToken(accessToken)
                    .userResponse(userResponse)
                    .build());
        } catch (Exception e) {
            log.error("Error during face-only login: {}", e.getMessage(), e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Face login failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    @PostMapping("/disable")
    public ResponseEntity<?> disableFaceId(@RequestBody(required = false) Map<String, String> request, Principal principal) {
        try {
            if (principal == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                        "success", false,
                        "message", "Authentication required to disable Face ID"
                    ));
            }
            
            // Use principal directly - the service can extract the user
            FaceIdResponse response = faceIdService.disableFaceId(principal);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error disabling Face ID: {}", e.getMessage(), e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to disable Face ID: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    @GetMapping("/status")
    public ResponseEntity<?> getFaceIdStatus(Principal principal) {
        try {
            if (principal == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                        "success", false,
                        "message", "Authentication required to check Face ID status"
                    ));
            }
            
            User user = userRepository.findByEmail(principal.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("enabled", user.isFaceIdEnabled());
            response.put("faceId", user.getFaceId());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error checking Face ID status: {}", e.getMessage(), e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to check Face ID status: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
      private void addRefreshTokenCookie(HttpServletResponse response, String refreshToken) {
        // Standard cookie approach
        Cookie cookie = new Cookie("refresh_token", refreshToken);
        cookie.setMaxAge((int) (refreshExpiration / 1000)); // Convert from ms to seconds
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setSecure(false); // Set to true in production with HTTPS
        response.addCookie(cookie);
        
        // Also set as header for better cross-browser compatibility with explicit SameSite=Lax
        SimpleDateFormat sdf = new SimpleDateFormat("EEE, dd MMM yyyy HH:mm:ss zzz");
        sdf.setTimeZone(TimeZone.getTimeZone("GMT"));
        String expires = sdf.format(new Date(System.currentTimeMillis() + refreshExpiration));
        
        response.addHeader("Set-Cookie", 
            String.format("refresh_token=%s; Path=/; Max-Age=%d; Expires=%s; HttpOnly; SameSite=Lax",
                refreshToken,
                (int) (refreshExpiration / 1000),
                expires));
    }
    
    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .userUUID(user.getUuid_user())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .image(user.getImage())
                .phone(user.getPhone())
                .address(user.getAddress())
                .birthDate(user.getBirthDate())
                .isActif(user.isActif())
                .Role(user.getRole())
                .faceIdEnabled(user.isFaceIdEnabled())
                .build();
    }
}