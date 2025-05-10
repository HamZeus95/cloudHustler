package tn.esprit.meddhiaalaya.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.meddhiaalaya.entity.Portefeuille;

@Repository

public interface PortefeuilleRepository extends JpaRepository<Portefeuille, Integer> {
}
