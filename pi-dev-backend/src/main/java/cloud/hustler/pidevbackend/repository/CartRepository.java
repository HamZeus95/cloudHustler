package cloud.hustler.pidevbackend.repository;

import cloud.hustler.pidevbackend.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface CartRepository extends JpaRepository<Cart, UUID> {
    @Query("SELECT c FROM Cart c WHERE c.consumer.uuid_user = :uuid")
    Optional<Cart> findByConsumerUuid(@Param("uuid") UUID uuid);
}
