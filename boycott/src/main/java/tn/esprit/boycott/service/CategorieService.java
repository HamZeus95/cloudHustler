package tn.esprit.boycott.service;

import jdk.jfr.Category;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.boycott.entity.Categorie;
import tn.esprit.boycott.repository.CategorieRepository;

@Service
public class CategorieService implements ICategoryService {
    @Autowired
    private CategorieRepository categorieRepository;

    @Override
    public void addCategory(Categorie categorie) {
        categorieRepository.save(categorie);

    }
}
