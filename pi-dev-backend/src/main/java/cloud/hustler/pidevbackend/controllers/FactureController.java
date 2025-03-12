package cloud.hustler.pidevbackend.controllers;

import cloud.hustler.pidevbackend.entity.Facture;
import cloud.hustler.pidevbackend.service.FactureService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFacture(@PathVariable Long id) {
        factureService.deleteFacture(id);
        return ResponseEntity.noContent().build();
    }
}