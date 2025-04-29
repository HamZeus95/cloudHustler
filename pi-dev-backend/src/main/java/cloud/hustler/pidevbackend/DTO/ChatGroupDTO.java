package cloud.hustler.pidevbackend.dto;

import cloud.hustler.pidevbackend.entity.ChatGroup;
import cloud.hustler.pidevbackend.entity.User;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ChatGroupDTO {
    private UUID id;
    private String name;
    private String description;
    private LocalDateTime createdAt;
    private UserDTO creator;
    private Set<UserDTO> admins = new HashSet<>();
    private Set<UserDTO> members = new HashSet<>();
    private int memberCount;
    private boolean isCurrentUserAdmin;
    private boolean isCurrentUserCreator;
    
    // Convert entity to DTO
    public static ChatGroupDTO fromEntity(ChatGroup group, User currentUser) {
        ChatGroupDTO dto = new ChatGroupDTO();
        dto.setId(group.getId());
        dto.setName(group.getName());
        dto.setDescription(group.getDescription());
        dto.setCreatedAt(group.getCreatedAt());
        
        if (group.getCreator() != null) {
            dto.setCreator(UserDTO.fromUser(group.getCreator()));
            dto.setCurrentUserCreator(group.getCreator().equals(currentUser));
        }
        
        // Add admins
        if (group.getAdmins() != null) {
            dto.setAdmins(group.getAdmins().stream()
                    .map(UserDTO::fromUser)
                    .collect(Collectors.toSet()));
            
            dto.setCurrentUserAdmin(group.getAdmins().contains(currentUser));
        }
        
        // Add members (limited to prevent large payloads)
        if (group.getMembers() != null) {
            dto.setMemberCount(group.getMembers().size());
            // Only send a subset of members to reduce payload size
            dto.setMembers(group.getMembers().stream()
                    .limit(20) // Limit to first 20 members
                    .map(UserDTO::fromUser)
                    .collect(Collectors.toSet()));
        }
        
        return dto;
    }
    
    // Simplified version for lists, with less data
    public static ChatGroupDTO fromEntitySimplified(ChatGroup group, User currentUser) {
        ChatGroupDTO dto = new ChatGroupDTO();
        dto.setId(group.getId());
        dto.setName(group.getName());
        dto.setDescription(group.getDescription());
        dto.setCreatedAt(group.getCreatedAt());
        
        if (group.getCreator() != null) {
            dto.setCreator(UserDTO.fromUser(group.getCreator()));
            dto.setCurrentUserCreator(group.getCreator().equals(currentUser));
        }
        
        dto.setCurrentUserAdmin(group.getAdmins() != null && group.getAdmins().contains(currentUser));
        dto.setMemberCount(group.getMembers() != null ? group.getMembers().size() : 0);
        
        return dto;
    }
}