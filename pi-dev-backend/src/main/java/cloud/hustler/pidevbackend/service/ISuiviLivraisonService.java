package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.entity.SuiviLivraison;

import java.util.List;

public interface ISuiviLivraisonService {
    SuiviLivraison ajouterSuivi(SuiviLivraison suivi);
    List<SuiviLivraison> getHistorique(Long livraisonId);
    public void deleteSuivi(Long id);
}