package cloud.hustler.pidevbackend.controllers;

import cloud.hustler.pidevbackend.dto.FaceIdLoginRequest;
import cloud.hustler.pidevbackend.dto.FaceIdRegisterRequest;
import cloud.hustler.pidevbackend.dto.FaceIdResponse;
import cloud.hustler.pidevbackend.entity.User;
import cloud.hustler.pidevbackend.repository.UserRepository;
import cloud.hustler.pidevbackend.service.IFaceIdService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/face-id")
@RequiredArgsConstructor
public class FaceIdController {

    private final IFaceIdService faceIdService;
    private final UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> registerFace(@RequestBody FaceIdRegisterRequest request, Principal principal) {
        // Get the authenticated user
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        FaceIdResponse response = faceIdService.registerFace(
                user.getUuid_user().toString(), 
                request.getImageBase64()
        );
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyFace(@RequestBody FaceIdLoginRequest request) {
        FaceIdResponse response = faceIdService.verifyFaceByEmail(
                request.getEmail(),
                request.getImageBase64()
        );
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/disable")
    public ResponseEntity<?> disableFaceId(@RequestBody Map<String, String> request, Principal principal) {
        // Get user ID - either from request or from principal
        String userId = request.getOrDefault("userId", null);
        
        // If no userId provided, use the authenticated user
        if (userId == null) {
            User user = userRepository.findByEmail(principal.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            userId = user.getUuid_user().toString();
        }
        
        FaceIdResponse response = faceIdService.disableFaceId(userId);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/status")
    public ResponseEntity<?> getFaceIdStatus(Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Map<String, Object> response = new HashMap<>();
        response.put("enabled", user.isFaceIdEnabled());
        response.put("faceId", user.getFaceId());
        
        return ResponseEntity.ok(response);
    }
}