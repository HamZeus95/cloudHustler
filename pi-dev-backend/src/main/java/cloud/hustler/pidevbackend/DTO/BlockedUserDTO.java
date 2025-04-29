package cloud.hustler.pidevbackend.dto;

import cloud.hustler.pidevbackend.entity.BlockedUser;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BlockedUserDTO {
    private UUID id;
    private UserDTO blocker;
    private UserDTO blocked;
    private LocalDateTime blockedAt;
    private String reason;
    private String imageUrl;
    
    // Convert entity to DTO
    public static BlockedUserDTO fromEntity(BlockedUser blockedUser) {
        BlockedUserDTO dto = new BlockedUserDTO();
        dto.setId(blockedUser.getId());
        
        if (blockedUser.getBlocker() != null) {
            dto.setBlocker(UserDTO.fromUser(blockedUser.getBlocker()));
        }
        
        if (blockedUser.getBlocked() != null) {
            dto.setBlocked(UserDTO.fromUser(blockedUser.getBlocked()));
        }
        
        dto.setBlockedAt(blockedUser.getBlockedAt());
        dto.setReason(blockedUser.getReason());
        
        return dto;
    }
}