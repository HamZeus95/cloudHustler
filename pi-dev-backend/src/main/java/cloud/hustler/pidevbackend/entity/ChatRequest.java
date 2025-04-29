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
@ToString
@EqualsAndHashCode
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "chat_requests")
public class ChatRequest {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "sender_id", nullable = false)
    User sender;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "receiver_id", nullable = false)
    User receiver;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    ChatRequestStatus status = ChatRequestStatus.PENDING;
    
    @Column(nullable = false)
    LocalDateTime createdAt = LocalDateTime.now();
    
    LocalDateTime updatedAt;
    
    // Method to approve a chat request
    public void approve() {
        this.status = ChatRequestStatus.APPROVED;
        this.updatedAt = LocalDateTime.now();
    }
    
    // Method to reject a chat request
    public void reject() {
        this.status = ChatRequestStatus.REJECTED;
        this.updatedAt = LocalDateTime.now();
    }
    
    // Custom toString to avoid circular references
    @Override
    public String toString() {
        return "ChatRequest{" +
                "id=" + id +
                ", senderId=" + (sender != null ? sender.getUuid_user() : null) +
                ", receiverId=" + (receiver != null ? receiver.getUuid_user() : null) +
                ", status=" + status +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}