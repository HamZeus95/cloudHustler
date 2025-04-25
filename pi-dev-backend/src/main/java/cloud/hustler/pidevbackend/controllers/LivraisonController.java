package cloud.hustler.pidevbackend.controllers;

import cloud.hustler.pidevbackend.entity.Livraison;
import cloud.hustler.pidevbackend.entity.SuiviLivraison;
import cloud.hustler.pidevbackend.service.AiService;
import cloud.hustler.pidevbackend.service.LivraisonService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/livraisons")
public class LivraisonController {

    @Autowired
    private LivraisonService livraisonService;

    @Autowired
    private AiService aiService;

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
    @GetMapping("/{id}")
    public ResponseEntity<Livraison> getLivraisonById(@PathVariable Long id) {
        Optional<Livraison> livraison = livraisonService.getLivraisonById(id);
        return livraison.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    @GetMapping("/by-user/{uuid}")
    public ResponseEntity<List<Livraison>> getLivraisonsByUser(@PathVariable("uuid") UUID uuid) {
        List<Livraison> livraisons = livraisonService.findByOrdreConsumerUuid(uuid);
        return ResponseEntity.ok(livraisons);
    }
    @GetMapping("/bydriver/{uuid}")
    public ResponseEntity<List<Livraison>> getLivraisonsByDriver(@PathVariable("uuid") UUID uuid) {
        List<Livraison> livraisons = livraisonService.findLivraisonsByDeliveryDriver_Uuid_user(uuid);
        return ResponseEntity.ok(livraisons);
    }
    @PostMapping("/predictdelay")
    public ResponseEntity<Boolean> predictDelay(@RequestBody Livraison livraison) {
        // Appeler l'API Hugging Face pour prédire le retard
        boolean isDelayed = aiService.predictDelay(livraison);
        return ResponseEntity.ok(isDelayed);
    }
    @PostMapping("/predicteta")
    public ResponseEntity<Integer> predictEta(@RequestBody Livraison livraison) {
        int eta = aiService.calculateEta(livraison);
        return ResponseEntity.ok(eta);
    }


}