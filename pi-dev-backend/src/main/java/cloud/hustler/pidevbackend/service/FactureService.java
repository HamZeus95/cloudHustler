package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.entity.DeliveryDriver;
import cloud.hustler.pidevbackend.entity.Facture;
import cloud.hustler.pidevbackend.entity.Livraison;
import cloud.hustler.pidevbackend.entity.Order;
import cloud.hustler.pidevbackend.repository.DeliverDriverRepository;
import cloud.hustler.pidevbackend.repository.FactureRepository;
import cloud.hustler.pidevbackend.repository.LivraisonRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class FactureService implements IFactureService{

    @Autowired
    private FactureRepository factureRepository;
    @Autowired
    private LivraisonRepository livraisonRepository;
    @Autowired
    private DeliverDriverRepository deliverDriverRepository;

    public Facture creerFacture(Facture facture) {
        Livraison lastLivraison = livraisonRepository.findTopByOrderByIdDesc();

         // Associer la dernière livraison automatiquement
            return factureRepository.save(facture); // Sauvegarder avec les autres champs déjà fournis

    }



    public List<Facture> getAllFactures() {
        return factureRepository.findAll();
    }

    public Optional<Facture> getFactureById(Long id) {
        return factureRepository.findById(id);
    }
    public Facture updateFacture(Long id, Facture facture) {
        Facture existingFacture = factureRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Facture not found"));


        return factureRepository.save(existingFacture);

    }

    public void deleteFacture(Long id) {
        Optional<Facture> facture = factureRepository.findById(id);
        if (facture.isPresent()) {
            factureRepository.delete(facture.get());
        } else {
            throw new EntityNotFoundException("Facture not found with id " + id);
        }
    }
    /*@Transactional
    public void marquerCommePayee(Long id) {
        // Récupérer la facture à partir de l'ID
        Facture facture = factureRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Facture non trouvée pour l'ID " + id));

        // Vérifier si la facture n'est pas déjà payée
        if ("PAYÉ".equals(facture.getStatut())) {
            throw new IllegalStateException("La facture est déjà marquée comme payée.");
        }

        // Modifier le statut de la facture
        facture.setStatut("PAYÉ");

        // Sauvegarder les modifications dans la base de données
        factureRepository.save(facture);
    }*/


    public void marquerCommeAnnulee(Long id) {
        // Récupérer la facture à partir de l'ID
        Facture facture = factureRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Facture non trouvée pour l'ID " + id));

        // Vérifier si la facture n'est pas déjà payée
        if ("Annulée".equals(facture.getStatut())||"ANNULÉE".equals(facture.getStatut())) {
            throw new IllegalStateException("La facture est déjà marquée comme annulée.");
        }

        // Modifier le statut de la facture
        facture.setStatut("ANNULÉE");

        // Sauvegarder les modifications dans la base de données
        factureRepository.save(facture);

    }

    @Override
    public List<Facture> findByLivraisonOrderConsumerUuid(UUID uuid) {
        return factureRepository.findByLivraisonOrderConsumerUuid(uuid);
    }

    @Override
    public List<DeliveryDriver> findDeliveryDriverByIsAvailable(boolean isAvailable) {
        return deliverDriverRepository.findDeliveryDriverByIsAvailable(isAvailable);
    }
    @PersistenceContext
    private EntityManager entityManager;

    public List<Order> getAllOrders() {
        return entityManager.createQuery("SELECT o FROM Order o", Order.class)
                .getResultList();
    }

   /* @Override
    public List<Facture> findAllByLivraison_Order_Consumer_Uuid_user(UUID uuid_user) {
        return factureRepository.findAllByLivraison_Order_Consumer_Uuid_user(uuid_user);
    }*/


}
