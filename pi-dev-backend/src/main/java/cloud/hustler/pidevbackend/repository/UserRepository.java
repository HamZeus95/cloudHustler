package cloud.hustler.pidevbackend.repository;

import cloud.hustler.pidevbackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

  Optional<User> findByEmail(String email);
  
  // Find user by faceId - needed for face-only login
  Optional<User> findByFaceId(String faceId);
  
  // Find all users with faceIdEnabled true
  List<User> findByFaceIdEnabled(boolean faceIdEnabled);
  
  // email exists
  boolean existsByEmail(String email);
}
