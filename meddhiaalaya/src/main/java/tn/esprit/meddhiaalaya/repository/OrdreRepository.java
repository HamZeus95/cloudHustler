package tn.esprit.meddhiaalaya.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.meddhiaalaya.entity.Ordre;



@Repository
public interface OrdreRepository extends JpaRepository<Ordre, Integer> {
}
