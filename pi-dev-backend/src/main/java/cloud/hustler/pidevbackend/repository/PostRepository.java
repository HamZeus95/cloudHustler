package cloud.hustler.pidevbackend.repository;

import cloud.hustler.pidevbackend.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;



public interface PostRepository extends JpaRepository<Post, Long> {
}
