package cloud.hustler.pidevbackend.repository;

import cloud.hustler.pidevbackend.entity.Otp;
import cloud.hustler.pidevbackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface OtpRepository extends JpaRepository<Otp, UUID> {
    
    Optional<Otp> findByOtpValueAndUsedFalse(String otpValue);
    
    @Query("SELECT o FROM Otp o WHERE o.user = ?1 AND o.used = false ORDER BY o.created_at DESC")
    Optional<Otp> findLatestActiveOtpForUser(User user);
    
    Optional<Otp> findByOtpValueAndUserAndUsedFalse(String otpValue, User user);
}