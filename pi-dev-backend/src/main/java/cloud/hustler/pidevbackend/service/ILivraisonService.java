package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.entity.Livraison;

import java.util.List;
import java.util.Optional;

public interface ILivraisonService {
    Livraison creerLivraison(Livraison livraison);
    List<Livraison> getAllLivraisons();
    Optional<Livraison> getLivraisonById(Long id);
    public Livraison updateLivraison(Long id, Livraison livraison);
    public void deleteLivraison(Long id);

}