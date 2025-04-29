package cloud.hustler.pidevbackend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "chat_messages")
public class ChatMessage {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID idMessage;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    String encryptedContent;
    
    @Column(nullable = false)
    LocalDateTime timestamp = LocalDateTime.now();
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    User sender;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_id")
    User receiver;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id")
    ChatGroup group;
    
    @Enumerated(EnumType.STRING)
    MessageType messageType = MessageType.TEXT;
    

    @Column(name = "is_read", nullable = false)
    boolean isRead = false;
    
    @Column
    LocalDateTime readAt;
    
    // Helper method to mark message as read
    public void markAsRead() {
        this.isRead = true;
        this.readAt = LocalDateTime.now();
    }
    
    // Check if this is a direct message
    public boolean isDirectMessage() {
        return this.receiver != null && this.group == null;
    }
    
    // Check if this is a group message
    public boolean isGroupMessage() {
        return this.group != null && this.receiver == null;
    }
    
    // Custom toString to avoid circular references
    @Override
    public String toString() {
        return "ChatMessage{" +
                "id=" + idMessage +
                ", timestamp=" + timestamp +
                ", senderId=" + (sender != null ? sender.getUuid_user() : null) +
                ", receiverId=" + (receiver != null ? receiver.getUuid_user() : null) +
                ", groupId=" + (group != null ? group.getId() : null) +
                ", messageType=" + messageType +
                ", read=" + isRead +
                ", readAt=" + readAt +
                '}';
    }
}