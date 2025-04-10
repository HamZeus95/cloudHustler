package cloud.hustler.pidevbackend.repository;
import cloud.hustler.pidevbackend.entity.Ressource;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ResourceRepository extends JpaRepository<Ressource, UUID> {
}
