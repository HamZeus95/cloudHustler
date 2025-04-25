package cloud.hustler.pidevbackend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "password_reset_tokens")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PasswordResetToken {
    
    @Id
    @GeneratedValue(strategy= GenerationType.UUID)
    UUID id;
    
    @Column(nullable = false, unique = true)
    String token;
    
    @ManyToOne
    @JoinColumn(nullable = false, name = "user_id")
    User user;
    
    @Column(nullable = false)
    LocalDateTime expiryDate;
    
    @Column(nullable = false)
    boolean used;
    
    @Column(nullable = false)
    LocalDateTime createdAt;
    
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiryDate);
    }
    
    @PrePersist
    public void prePersist() {
        if (this.token == null) {
            this.token = UUID.randomUUID().toString();
        }
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.expiryDate == null) {
            // Default expiry of 1 hour from creation
            this.expiryDate = this.createdAt.plusHours(1);
        }
    }
}