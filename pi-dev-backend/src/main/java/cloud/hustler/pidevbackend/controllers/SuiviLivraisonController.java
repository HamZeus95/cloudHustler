package cloud.hustler.pidevbackend.controllers;

import cloud.hustler.pidevbackend.entity.SuiviLivraison;
import cloud.hustler.pidevbackend.service.SuiviLivraisonService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/suiviLivraison")
public class SuiviLivraisonController {

    @Autowired
    private SuiviLivraisonService suiviLivraisonService;

    @PostMapping
    public SuiviLivraison ajouterSuivi(@Valid @RequestBody SuiviLivraison suivi) {
        return suiviLivraisonService.ajouterSuivi(suivi);
    }

    @GetMapping("/{livraisonId}")
    public List<SuiviLivraison> getHistorique(@PathVariable Long livraisonId) {
        return suiviLivraisonService.getHistorique(livraisonId);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSuivi(@PathVariable Long id) {
        suiviLivraisonService.deleteSuivi(id);
        return ResponseEntity.noContent().build();
    }
}
