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
@Table(name = "blocked_users")
public class BlockedUser {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "blocker_id", nullable = false)
    User blocker;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "blocked_id", nullable = false)
    User blocked;
    
    @Column(nullable = false)
    LocalDateTime blockedAt = LocalDateTime.now();
    
    String reason;
    
    // Custom toString to avoid circular references
    @Override
    public String toString() {
        return "BlockedUser{" +
                "id=" + id +
                ", blockerId=" + (blocker != null ? blocker.getUuid_user() : null) +
                ", blockedId=" + (blocked != null ? blocked.getUuid_user() : null) +
                ", blockedAt=" + blockedAt +
                ", reason='" + reason + '\'' +
                '}';
    }
}