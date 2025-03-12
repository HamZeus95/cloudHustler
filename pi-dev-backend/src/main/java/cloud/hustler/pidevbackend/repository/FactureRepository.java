package cloud.hustler.pidevbackend.repository;

import cloud.hustler.pidevbackend.entity.Facture;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FactureRepository extends JpaRepository<Facture, Long> {
}