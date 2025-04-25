package cloud.hustler.pidevbackend.repository;

import cloud.hustler.pidevbackend.entity.DeliveryDriver;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface DeliverDriverRepository extends JpaRepository<DeliveryDriver, UUID> {
    public List<DeliveryDriver> findDeliveryDriverByIsAvailable(boolean isAvailable);
}
