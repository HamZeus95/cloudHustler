package cloud.hustler.pidevbackend.repository;

import cloud.hustler.pidevbackend.entity.Consumer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ConsumerRepository extends JpaRepository<Consumer, UUID> {
}
