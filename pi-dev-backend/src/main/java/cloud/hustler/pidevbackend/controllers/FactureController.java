package cloud.hustler.pidevbackend.controllers;

import cloud.hustler.pidevbackend.entity.Facture;
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

    @PostMapping
    public Facture creerFacture(@Valid @RequestBody Facture facture) {
        return factureService.creerFacture(facture);
    }

    @GetMapping
    public List<Facture> getAllFactures() {
        return factureService.getAllFactures();
    }
    @PutMapping("/{id}")
    public ResponseEntity<Facture> updateFacture(@Valid @PathVariable Long id, @RequestBody Facture facture) {
        Facture updatedFacture = factureService.updateFacture(id, facture);
        return ResponseEntity.ok(updatedFacture);
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
    @PostMapping("/{id}")
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
    }
}