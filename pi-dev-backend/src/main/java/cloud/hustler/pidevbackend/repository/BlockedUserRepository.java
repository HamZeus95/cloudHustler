package cloud.hustler.pidevbackend.repository;

import cloud.hustler.pidevbackend.entity.BlockedUser;
import cloud.hustler.pidevbackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BlockedUserRepository extends JpaRepository<BlockedUser, UUID> {
    
    // Find all users blocked by a specific user
    List<BlockedUser> findByBlocker(User blocker);
    
    // Find all users blocked by a specific user with eager fetch
    @Query("SELECT b FROM BlockedUser b LEFT JOIN FETCH b.blocker LEFT JOIN FETCH b.blocked WHERE b.blocker = :blocker")
    List<BlockedUser> findByBlockerWithEagerFetch(@Param("blocker") User blocker);
    
    // Find all users who have blocked a specific user
    List<BlockedUser> findByBlocked(User blocked);
    
    // Find specific blocking relationship
    Optional<BlockedUser> findByBlockerAndBlocked(User blocker, User blocked);
    
    // Check if a user is blocked by another user
    boolean existsByBlockerAndBlocked(User blocker, User blocked);
    
    // Delete a blocking relationship
    void deleteByBlockerAndBlocked(User blocker, User blocked);
}