package cloud.hustler.pidevbackend.dto;

import cloud.hustler.pidevbackend.entity.ChatRequest;
import cloud.hustler.pidevbackend.entity.ChatRequestStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatRequestDTO {
    private UUID id;
    private UUID senderId;
    private String senderName;
    private String senderProfileImage;
    private UUID receiverId;
    private String receiverName;
    private String receiverProfileImage;
    private ChatRequestStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Convert entity to DTO
    public static ChatRequestDTO fromEntity(ChatRequest chatRequest) {
        ChatRequestDTO dto = new ChatRequestDTO();
        dto.setId(chatRequest.getId());
        
        if (chatRequest.getSender() != null) {
            dto.setSenderId(chatRequest.getSender().getUuid_user());
            dto.setSenderName(chatRequest.getSender().getUsername());
            // Set profile image if available
            // dto.setSenderProfileImage(chatRequest.getSender().getProfileImage());
        }
        
        if (chatRequest.getReceiver() != null) {
            dto.setReceiverId(chatRequest.getReceiver().getUuid_user());
            dto.setReceiverName(chatRequest.getReceiver().getUsername());
            // Set profile image if available
            // dto.setReceiverProfileImage(chatRequest.getReceiver().getProfileImage());
        }
        
        dto.setStatus(chatRequest.getStatus());
        dto.setCreatedAt(chatRequest.getCreatedAt());
        dto.setUpdatedAt(chatRequest.getUpdatedAt());
        
        return dto;
    }
}