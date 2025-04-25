package cloud.hustler.pidevbackend.repository;

import cloud.hustler.pidevbackend.entity.OrderItem;
import cloud.hustler.pidevbackend.entity.ProductSalesDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface OrderItemRepository extends JpaRepository<OrderItem, UUID> {
    //List<OrderItem> findByOrderUuidOrder(UUID orderUuid);
    @Query("SELECT oi.product.name AS productName, SUM(oi.quantity) AS totalQuantitySold " +
            "FROM OrderItem oi " +
            "GROUP BY oi.product.name " +
            "ORDER BY SUM(oi.quantity) DESC " +
            "LIMIT 5")
    List<ProductSalesDTO> findTop5BestSellingProducts();
}
