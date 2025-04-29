package cloud.hustler.pidevbackend.dto;

import cloud.hustler.pidevbackend.entity.ChatMessage;
import cloud.hustler.pidevbackend.entity.MessageType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessageDTO {
    private UUID id;
    private String content; // Decrypted content on the server
    private LocalDateTime timestamp;
    private UUID senderId;
    private String senderName;
    private String senderProfileImage;
    private UUID receiverId;
    private String receiverName;
    private UUID groupId;
    private String groupName;
    private MessageType messageType;
    private boolean read;
    private LocalDateTime readAt;
    
    // Convert entity to DTO
    public static ChatMessageDTO fromEntity(ChatMessage message) {
        ChatMessageDTO dto = new ChatMessageDTO();
        dto.setId(message.getIdMessage());
        dto.setContent(message.getEncryptedContent()); // Should be already decrypted in service layer
        dto.setTimestamp(message.getTimestamp());
        
        if (message.getSender() != null) {
            dto.setSenderId(message.getSender().getUuid_user());
            dto.setSenderName(message.getSender().getUsername());
            // Set profile image if available
            // dto.setSenderProfileImage(message.getSender().getProfileImage());
        }
        
        if (message.getReceiver() != null) {
            dto.setReceiverId(message.getReceiver().getUuid_user());
            dto.setReceiverName(message.getReceiver().getUsername());
        }
        
        if (message.getGroup() != null) {
            dto.setGroupId(message.getGroup().getId());
            dto.setGroupName(message.getGroup().getName());
        }
        
        dto.setMessageType(message.getMessageType());
        dto.setRead(message.isRead());
        dto.setReadAt(message.getReadAt());
        
        return dto;
    }
}