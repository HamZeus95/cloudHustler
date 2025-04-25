package cloud.hustler.pidevbackend.repository;

import cloud.hustler.pidevbackend.entity.Facture;
import cloud.hustler.pidevbackend.entity.Livraison;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface FactureRepository extends JpaRepository<Facture, Long> {
    //List<Facture> findAllByLivraisonOrderConsumerUserUuid_user(UUID uuid_user);
   // List<Facture> findAllByLivraison_Order_Consumer_Uuid_user(UUID uuid_user);
    @Query("SELECT f FROM Facture f WHERE f.livraison.order.consumer.uuid_user = :uuid")
    List<Facture> findByLivraisonOrderConsumerUuid(@Param("uuid") UUID uuid);



}

