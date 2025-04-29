package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.entity.Livraison;
import cloud.hustler.pidevbackend.repository.LivraisonRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class LivraisonService implements ILivraisonService {

    @Autowired
    private LivraisonRepository livraisonRepository;

    public Livraison creerLivraison(Livraison livraison) {
        // Fixer la date de création à maintenant
        LocalDate now = LocalDate.now();
        livraison.setDateCreation(now);

        // Fixer la date de livraison à 2 jours après la date de création
        //livraison.setDateLivraison(now.plusDays(2));

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

    @Override
    public List<Livraison> findByOrdreConsumerUuid(UUID uuid_user) {
        System.out.println(uuid_user);
        return livraisonRepository.findByOrderConsumerUuid(uuid_user);
    }

    @Override
    public List<Livraison> findLivraisonsByDeliveryDriver_Uuid_user(UUID uuid) {
        return livraisonRepository.findLivraisonsByDeliveryDriver_Uuid_user(uuid);
    }

    public Livraison getLastLivraison() {
        return livraisonRepository.findTopByOrderByIdDesc();  // Récupère la dernière Livraison par ID
    }
    public void desaffecterLivraison(Long livraisonId) {
        Livraison livraison = livraisonRepository.findById(livraisonId)
                .orElseThrow(() -> new RuntimeException("Livraison introuvable"));
        livraison.setDeliveryDriver(null);
        livraisonRepository.save(livraison);
    }


}
