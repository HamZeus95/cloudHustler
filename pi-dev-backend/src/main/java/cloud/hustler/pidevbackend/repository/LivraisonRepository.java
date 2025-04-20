package cloud.hustler.pidevbackend.repository;

import cloud.hustler.pidevbackend.entity.Livraison;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface LivraisonRepository extends JpaRepository<Livraison, Long> {
    Livraison findTopByOrderByIdDesc();
    @Query("SELECT l FROM Livraison l WHERE l.order.consumer.uuid_user = :uuid")
    List<Livraison> findByOrderConsumerUuid(@Param("uuid") UUID uuid);}
