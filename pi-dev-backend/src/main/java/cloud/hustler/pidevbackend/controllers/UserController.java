package cloud.hustler.pidevbackend.controllers;

import cloud.hustler.pidevbackend.dto.ChangePasswordRequest;
import cloud.hustler.pidevbackend.dto.UserNotConsumerDTO;
import cloud.hustler.pidevbackend.dto.UserResponse;
import cloud.hustler.pidevbackend.dto.UserUpdateRequest;
import cloud.hustler.pidevbackend.service.user.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final IUserService userService;

    @GetMapping("/{userId}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable UUID userId) {
        UserResponse user = userService.getUserById(userId);
        return ResponseEntity.ok(user);
    }

    @PutMapping(value = "/profile/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> updateProfile(
            @RequestParam(value = "firstName", required = false) String firstName,
            @RequestParam(value = "lastName", required = false) String lastName,
            @RequestParam(value = "phone", required = false) String phone,
            @RequestParam(value = "address", required = false) String address,
            @RequestParam(value = "birthDate", required = false) String birthDate,
            @RequestParam(value = "image", required = false) MultipartFile image,
            Principal connectedUser) {
        
        try {
            // Create UserUpdateRequest object from form data
            UserUpdateRequest updateRequest = new UserUpdateRequest();
            updateRequest.setFirstName(firstName);
            updateRequest.setLastName(lastName);
            updateRequest.setPhone(phone);
            updateRequest.setAddress(address);
            
            // Parse birthDate if provided
            if (birthDate != null && !birthDate.isEmpty()) {
                java.text.SimpleDateFormat format = new java.text.SimpleDateFormat("yyyy-MM-dd");
                updateRequest.setBirthDate(format.parse(birthDate));
            }
            
            // Set image if provided
            if (image != null && !image.isEmpty()) {
                updateRequest.setImageFile(image);
            }
            
            // Update profile
            UserResponse updatedUser = userService.updateProfile(updateRequest, connectedUser);
            
            // Create response
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Profile updated successfully");
            response.put("userResponse", updatedUser);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Failed to update profile: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    @PostMapping("/change-password")
    public ResponseEntity<Map<String, Object>> changePassword(
            @RequestBody ChangePasswordRequest request,
            Principal connectedUser) {
        
        try {
            userService.changePasssword(request, connectedUser);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Password changed successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Failed to change password: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    @PostMapping(value = "/upload-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> uploadImage(@RequestParam("image") MultipartFile image) {
        try {
            String imagePath = userService.saveUserImage(image);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Image uploaded successfully");
            response.put("imagePath", imagePath);
            
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Failed to upload image: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    // find users not consumer by role with query param
    @GetMapping("/not-consumer")
    public ResponseEntity<List<UserNotConsumerDTO>> getAllUsersNotConsumer(
        @RequestParam(value = "query", required = false) String query) {
    List<UserNotConsumerDTO> users = userService.getAllUsersNotConsumer(query);
    return ResponseEntity.ok(users);
}

    
   
}