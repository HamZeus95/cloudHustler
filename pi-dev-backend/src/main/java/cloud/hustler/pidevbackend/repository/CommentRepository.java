package cloud.hustler.pidevbackend.repository;

import cloud.hustler.pidevbackend.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CommentRepository extends JpaRepository<Comment, UUID > {
    List<Comment> findByPostIdPost(UUID idPost);


}
