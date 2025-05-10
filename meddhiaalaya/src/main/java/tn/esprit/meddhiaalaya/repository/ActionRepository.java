package tn.esprit.meddhiaalaya.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.meddhiaalaya.entity.Action;



@Repository
public interface ActionRepository extends JpaRepository<Action, Integer> {

}
