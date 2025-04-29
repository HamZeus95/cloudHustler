package cloud.hustler.pidevbackend.repository;

import cloud.hustler.pidevbackend.entity.DeliveryDriver;
import cloud.hustler.pidevbackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

  // find users not having the specified discriminator value
  @Query("SELECT u FROM User u WHERE TYPE(u) <> :#{#role}")
  List<User> findByTypeNot(@Param("role") Class<?> role);

  // boolean existsByEmail(String email);
  @Query("SELECT u FROM User u WHERE u.uuid_user = :uuid")
  Optional<User> findByUuid_user(@Param("uuid") UUID uuid);

}
