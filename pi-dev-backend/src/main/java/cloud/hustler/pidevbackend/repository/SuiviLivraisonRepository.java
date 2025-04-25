package cloud.hustler.pidevbackend.repository;

import cloud.hustler.pidevbackend.entity.SuiviLivraison;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SuiviLivraisonRepository extends JpaRepository<SuiviLivraison, Long> {
    List<SuiviLivraison> findByLivraisonId(Long livraisonId);
}
