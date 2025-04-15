package cloud.hustler.pidevbackend.controllers;

import cloud.hustler.pidevbackend.entity.Facture;
import cloud.hustler.pidevbackend.repository.FactureRepository;
import cloud.hustler.pidevbackend.service.FactureService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/factures")
public class FactureController {

    @Autowired
    private FactureService factureService;
    @Autowired
    private FactureRepository factureRepository;

    @PostMapping
    public Facture creerFacture(@Valid @RequestBody Facture facture) {
        return factureService.creerFacture(facture);
    }

    @GetMapping
    public List<Facture> getAllFactures() {
        return factureService.getAllFactures();
    }
    @PutMapping("/{id}")
    public ResponseEntity<Facture> updateFacture(@PathVariable Long id, @RequestBody Facture facture) {
        Facture existingFacture = factureRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Facture non trouvée pour l'ID : " + id));

        // Mettre à jour les champs de la facture avec les nouvelles valeurs
        existingFacture.setDateEmission(facture.getDateEmission());
        existingFacture.setMontantTotal(facture.getMontantTotal());
        existingFacture.setStatut(facture.getStatut());

        // On s'assure que la livraison ne change pas
        // existingFacture.setLivraison(facture.getLivraison()); // ne pas mettre à jour la livraison

        // Sauvegarder la facture mise à jour dans la base de données
        factureRepository.save(existingFacture);

        return ResponseEntity.ok(existingFacture); // Retourne la facture mise à jour
    }


    @GetMapping("/{id}")
    public Optional<Facture> getFactureById(@PathVariable Long id) {
        return factureService.getFactureById(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFacture(@PathVariable Long id) {
        factureService.deleteFacture(id);
        return ResponseEntity.noContent().build();
    }
    /*@PostMapping("/payer/{id}")
    public ResponseEntity<String> marquerCommePayee(@PathVariable Long id) {
        try {
            factureService.marquerCommePayee(id);
            return ResponseEntity.ok("Facture marquée comme payée");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Facture non trouvée");
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur lors de la mise à jour de la facture");
        }
    }*/
    @PostMapping("/annuler/{id}")
    public ResponseEntity<String> marquerCommeAnnulee(@PathVariable Long id) {
        try {
            factureService.marquerCommeAnnulee(id);
            return ResponseEntity.ok("Facture marquée comme Annulée");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Facture non trouvée");
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur lors de la mise à jour de la facture");
        }
    }
}