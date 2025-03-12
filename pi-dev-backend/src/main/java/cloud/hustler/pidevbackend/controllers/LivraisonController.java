package cloud.hustler.pidevbackend.controllers;

import cloud.hustler.pidevbackend.entity.Livraison;
import cloud.hustler.pidevbackend.service.LivraisonService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/livraisons")
public class LivraisonController {

    @Autowired
    private LivraisonService livraisonService;

    @PostMapping
    public Livraison creerLivraison(@Valid @RequestBody Livraison livraison) {
        return livraisonService.creerLivraison(livraison);
    }

    @GetMapping
    public List<Livraison> getAllLivraisons() {
        return livraisonService.getAllLivraisons();
    }
    @PutMapping("/{id}")
    public ResponseEntity<Livraison> updateLivraison(@Valid @PathVariable Long id, @RequestBody Livraison livraison) {
        Livraison updatedLivraison = livraisonService.updateLivraison(id, livraison);
        return ResponseEntity.ok(updatedLivraison);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLivraison(@PathVariable Long id) {
        livraisonService.deleteLivraison(id);
        return ResponseEntity.noContent().build();
    }
}