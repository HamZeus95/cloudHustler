package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.entity.Facture;
import cloud.hustler.pidevbackend.entity.Livraison;
import cloud.hustler.pidevbackend.repository.FactureRepository;
import cloud.hustler.pidevbackend.repository.LivraisonRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class FactureService implements IFactureService{

    @Autowired
    private FactureRepository factureRepository;
    @Autowired
    private LivraisonRepository livraisonRepository;

    public Facture creerFacture(Facture facture) {
        Livraison lastLivraison = livraisonRepository.findTopByOrderByIdDesc();

        if (lastLivraison != null) {
            // Créer une nouvelle facture
             facture = new Facture();
            facture.setLivraison(lastLivraison); // Associer la dernière Livraison à la Facture
           /* facture.setDateEmission(LocalDate.now()); // Exemple de date
            facture.setMontantTotal(100.0); // Exemple de montant
            facture.setStatut("En cours"); // Exemple de statut*/

            // Sauvegarder la facture dans la base de données
             return factureRepository.save(facture);
        } else {
            // Si aucune Livraison n'est trouvée
            throw new RuntimeException("Aucune Livraison trouvée pour créer une Facture");
        }
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
    @Transactional
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
    }



}
