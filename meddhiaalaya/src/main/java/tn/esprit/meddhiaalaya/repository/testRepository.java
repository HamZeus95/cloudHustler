package tn.esprit.meddhiaalaya.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.meddhiaalaya.entity.test;

@Repository
public interface testRepository extends JpaRepository<test, Integer> {

}
