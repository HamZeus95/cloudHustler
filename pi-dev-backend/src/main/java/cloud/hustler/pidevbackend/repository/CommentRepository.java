package cloud.hustler.pidevbackend.repository;

import cloud.hustler.pidevbackend.entity.Comment;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface CommentRepository extends JpaRepository<Comment, UUID > {
    List<Comment> findByPostIdPost(UUID idPost);
    @Transactional
    @Modifying
    @Query("DELETE FROM Comment c WHERE c.post.idPost = :postId")
    void deleteAllByPostId(@Param("postId") UUID postId);

}
