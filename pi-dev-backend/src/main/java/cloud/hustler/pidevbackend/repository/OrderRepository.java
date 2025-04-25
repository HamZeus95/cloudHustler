package cloud.hustler.pidevbackend.repository;

import cloud.hustler.pidevbackend.entity.Cart;
import cloud.hustler.pidevbackend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface OrderRepository extends JpaRepository<Order, UUID> {
    @Query("SELECT c FROM Order c WHERE c.consumer.uuid_user = :uuid")
    List<Order> findByConsumerUuid(@Param("uuid") UUID uuid);
}
