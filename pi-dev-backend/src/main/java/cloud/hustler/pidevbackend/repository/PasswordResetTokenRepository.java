package cloud.hustler.pidevbackend.repository;

import cloud.hustler.pidevbackend.entity.PasswordResetToken;
import cloud.hustler.pidevbackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);
    List<PasswordResetToken> findByUser(User user);
    Optional<PasswordResetToken> findByTokenAndUsed(String token, boolean used);
    void deleteByUser(User user);
}