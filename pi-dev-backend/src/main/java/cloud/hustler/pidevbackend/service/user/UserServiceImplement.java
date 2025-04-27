package cloud.hustler.pidevbackend.service.user;

import cloud.hustler.pidevbackend.dto.ChangePasswordRequest;
import cloud.hustler.pidevbackend.dto.UserResponse;
import cloud.hustler.pidevbackend.dto.UserUpdateRequest;
import cloud.hustler.pidevbackend.entity.User;
import cloud.hustler.pidevbackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImplement implements IUserService {
    @Autowired
    private final UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Value("${app.upload.dir:${user.home}/uploads}")
    private String uploadDir;

    @Override
    public void changePasssword(ChangePasswordRequest request, Principal connectedUser) {
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();

        // check if the current password is correct
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new IllegalStateException("Wrong password");
        }
        // check if the two new passwords are the same
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new IllegalStateException("Password are not the same");
        }

        // update the password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        // save the new password
        userRepository.save(user);
    }
    
    @Override
    public UserResponse updateProfile(UserUpdateRequest updateRequest, Principal connectedUser) throws IOException {
        // Get the authenticated user
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
        
        // Update user fields if provided
        if (updateRequest.getFirstName() != null && !updateRequest.getFirstName().isEmpty()) {
            user.setFirstName(updateRequest.getFirstName());
        }
        
        if (updateRequest.getLastName() != null && !updateRequest.getLastName().isEmpty()) {
            user.setLastName(updateRequest.getLastName());
        }
        
        if (updateRequest.getPhone() != null && !updateRequest.getPhone().isEmpty()) {
            user.setPhone(updateRequest.getPhone());
        }
        
        if (updateRequest.getAddress() != null && !updateRequest.getAddress().isEmpty()) {
            user.setAddress(updateRequest.getAddress());
        }
        
        if (updateRequest.getBirthDate() != null) {
            user.setBirthDate(updateRequest.getBirthDate());
        }
        
        // Handle image upload if provided
        if (updateRequest.getImageFile() != null && !updateRequest.getImageFile().isEmpty()) {
            // Check if user is authenticated with OAuth (Google or GitHub)
            if (isOAuthUser(user)) {
                throw new IllegalStateException("Profile picture cannot be changed for users authenticated with Google or GitHub");
            }
            
            // Store the old image filename before updating
            String oldImageFilename = user.getImage();
            
            // Save the new image and get its filename
            String newImageFilename = saveUserImage(updateRequest.getImageFile());
            
            // Set the new image filename for the user
            user.setImage(newImageFilename);
            
            // Delete the old image file if it exists and is not from an external source
            if (oldImageFilename != null && !oldImageFilename.isEmpty() 
                    && !oldImageFilename.startsWith("http://") 
                    && !oldImageFilename.startsWith("https://")) {
                deleteUserImage(oldImageFilename);
            }
        }
        
        // Save updated user
        User updatedUser = userRepository.save(user);
        
        // Return the updated user response
        return UserResponse.builder()
                .userUUID(updatedUser.getUuid_user())
                .firstName(updatedUser.getFirstName())
                .lastName(updatedUser.getLastName())
                .email(updatedUser.getEmail())
                .phone(updatedUser.getPhone())
                .address(updatedUser.getAddress())
                .image(updatedUser.getImage())
                .birthDate(updatedUser.getBirthDate())
                .Role(updatedUser.getRole())
                .isActif(updatedUser.isActif())
                .build();
    }
    
    /**
     * Deletes a user image file from the upload directory
     * @param filename the filename of the image to delete (not the full path)
     */
    private void deleteUserImage(String filename) {
        try {
            Path filePath = Paths.get(uploadDir, filename).toAbsolutePath().normalize();
            File file = filePath.toFile();
            
            if (file.exists()) {
                boolean deleted = file.delete();
                if (deleted) {
                    System.out.println("Successfully deleted old image: " + filePath);
                } else {
                    System.err.println("Failed to delete old image: " + filePath);
                }
            } else {
                System.out.println("Old image file not found: " + filePath);
            }
        } catch (Exception ex) {
            // Log the error but don't prevent the user update operation
            System.err.println("Error deleting old image file: " + ex.getMessage());
            ex.printStackTrace();
        }
    }
    
    @Override
    public UserResponse getUserById(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + userId));
        
        return UserResponse.builder()
                .userUUID(user.getUuid_user())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .address(user.getAddress())
                .image(user.getImage())
                .birthDate(user.getBirthDate())
                .Role(user.getRole())
                .isActif(user.isActif())
                .build();
    }
    
    @Override
    public String saveUserImage(MultipartFile file) throws IOException {
        try {
            // Get the upload directory
            String uploadPath = uploadDir;
            File directory = new File(uploadPath);
            if (!directory.exists()) {
                boolean created = directory.mkdirs();
                if (!created) {
                    throw new IOException("Failed to create directory: " + uploadPath);
                }
                System.out.println("Created directory: " + uploadPath);
            }
            
            // Generate a unique filename
            String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename().replaceAll("\\s+", "_");
            Path targetLocation = Paths.get(uploadPath, filename).toAbsolutePath().normalize();
            System.out.println("Saving file to: " + targetLocation);
            
            // Save the file
            Files.copy(file.getInputStream(), targetLocation, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
            
            System.out.println("File saved successfully to: " + targetLocation);
            
            // Return only the filename, not the full path
            return filename;
        } catch (IOException ex) {
            System.err.println("Error saving file: " + ex.getMessage());
            ex.printStackTrace();
            throw new IOException("Could not store file. Error: " + ex.getMessage(), ex);
        }
    }

    @Override
    public Optional<User> findByUuid(String uuid) {
        return userRepository.findByUuid_user(UUID.fromString(uuid));
    }
    /**
     * Checks if a user was authenticated via OAuth (Google or GitHub)
     * @param user the user to check
     * @return true if the user authenticated via OAuth, false otherwise
     */
    private boolean isOAuthUser(User user) {
        return user.getProvider() != null && 
               (user.getProvider().equals("google") || user.getProvider().equals("github"));
    }
}
