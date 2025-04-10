package cloud.hustler.pidevbackend.repository;

import cloud.hustler.pidevbackend.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CartItemRepository extends JpaRepository<CartItem, UUID> {
    //List<CartItem> findByCart_Uuid_cart(UUID uuid_cart);

}
