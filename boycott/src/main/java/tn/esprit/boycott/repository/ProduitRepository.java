package tn.esprit.boycott.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.boycott.entity.Produit;

@Repository
public interface ProduitRepository extends JpaRepository<Produit, Long> {
}
