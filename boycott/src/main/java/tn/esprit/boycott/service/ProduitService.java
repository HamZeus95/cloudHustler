package tn.esprit.boycott.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.boycott.entity.Produit;
import tn.esprit.boycott.repository.ProduitRepository;

@Service
public class ProduitService implements IProduitService {
    @Autowired
    ProduitRepository produitRepository;



    public Produit ajouterProduitEtCategories(Produit p) {

        produitRepository.save(p);

    }
}
