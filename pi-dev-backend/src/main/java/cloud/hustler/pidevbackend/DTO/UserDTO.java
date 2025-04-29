package cloud.hustler.pidevbackend.dto;
 
import cloud.hustler.pidevbackend.entity.User;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private UUID id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String profileImage;
    private String role;
    private boolean online;
    
    // Convert User entity to UserDTO safely without accessing lazy collections
    public static UserDTO fromUser(User user) {
        if (user == null) {
            return null;
        }
        
        UserDTO dto = new UserDTO();
        dto.setId(user.getUuid_user());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setRole(user.getRole());
        
        // Set profile image if available
        // dto.setProfileImage(user.getProfileImage());
        
        // Online status would be managed elsewhere, like in a session registry
        
        return dto;
    }
}