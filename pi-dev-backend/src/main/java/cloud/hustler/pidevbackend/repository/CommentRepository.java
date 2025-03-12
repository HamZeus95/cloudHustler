package cloud.hustler.pidevbackend.repository;

import cloud.hustler.pidevbackend.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Long> {
}
