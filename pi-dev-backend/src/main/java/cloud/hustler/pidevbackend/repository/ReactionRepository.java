package cloud.hustler.pidevbackend.repository;

import cloud.hustler.pidevbackend.entity.Reaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReactionRepository extends JpaRepository<Reaction, Long> {
}
