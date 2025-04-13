package cloud.hustler.pidevbackend.repository;

import cloud.hustler.pidevbackend.entity.Reaction;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface ReactionRepository extends JpaRepository<Reaction, UUID> {

    @Transactional
    @Modifying
    @Query("DELETE FROM Reaction r WHERE r.post.idPost = :postId")
    void deleteAllReactionByPostId(@Param("postId") UUID postId);
}
