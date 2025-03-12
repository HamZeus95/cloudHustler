package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.entity.SuiviLivraison;
import cloud.hustler.pidevbackend.repository.SuiviLivraisonRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SuiviLivraisonService implements ISuiviLivraisonService {

    @Autowired
    private SuiviLivraisonRepository suiviLivraisonRepository;

    public SuiviLivraison ajouterSuivi(SuiviLivraison suivi) {
        return suiviLivraisonRepository.save(suivi);
    }

    public List<SuiviLivraison> getHistorique(Long livraisonId) {
        return suiviLivraisonRepository.findByLivraisonId(livraisonId);
    }
    public void deleteSuivi(Long id) {
        if (!suiviLivraisonRepository.existsById(id)) {
            throw new EntityNotFoundException("Suivi de livraison non trouvé");
        }
        suiviLivraisonRepository.deleteById(id);
    }

}
