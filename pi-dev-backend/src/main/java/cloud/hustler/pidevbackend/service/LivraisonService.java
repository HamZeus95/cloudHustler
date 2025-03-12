package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.entity.Livraison;
import cloud.hustler.pidevbackend.repository.LivraisonRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class LivraisonService implements ILivraisonService {

    @Autowired
    private LivraisonRepository livraisonRepository;

    public Livraison creerLivraison(Livraison livraison) {
        return livraisonRepository.save(livraison);
    }

    public List<Livraison> getAllLivraisons() {
        return livraisonRepository.findAll();
    }

    public Optional<Livraison> getLivraisonById(Long id) {
        return livraisonRepository.findById(id);
    }
    public Livraison updateLivraison(Long id, Livraison livraison) {
        if (!livraisonRepository.existsById(id)) {
            throw new EntityNotFoundException("Livraison non trouvée");
        }
        return livraisonRepository.save(livraison);
    }

    public void deleteLivraison(Long id) {
        if (!livraisonRepository.existsById(id)) {
            throw new EntityNotFoundException("Livraison non trouvée");
        }
        livraisonRepository.deleteById(id);
    }

}
