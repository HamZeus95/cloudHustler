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
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Otp {
    @Id
    @GeneratedValue(strategy= GenerationType.UUID)
    UUID uuid_otp;
    String otpValue;
    LocalDateTime created_at;
    LocalDateTime expires_at;
    boolean used;

    @ManyToOne(fetch = FetchType.LAZY)
    User user;
    
    // Constructor for generating new OTP
    public Otp(User user, String otpValue, int expirationMinutes) {
        this.user = user;
        this.otpValue = otpValue;
        this.created_at = LocalDateTime.now();
        this.expires_at = LocalDateTime.now().plusMinutes(expirationMinutes);
        this.used = false;
    }
    
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(this.expires_at);
    }
    
    public void markAsUsed() {
        this.used = true;
    }
}
