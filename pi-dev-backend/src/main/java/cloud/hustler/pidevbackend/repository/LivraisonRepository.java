package cloud.hustler.pidevbackend.repository;

import cloud.hustler.pidevbackend.entity.Livraison;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LivraisonRepository extends JpaRepository<Livraison, Long> {
}
