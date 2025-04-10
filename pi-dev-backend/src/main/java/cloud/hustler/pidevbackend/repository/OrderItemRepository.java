package cloud.hustler.pidevbackend.repository;

import cloud.hustler.pidevbackend.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface OrderItemRepository extends JpaRepository<OrderItem, UUID> {
    //List<OrderItem> findByOrderUuidOrder(UUID orderUuid);
}
