package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.entity.*;
import cloud.hustler.pidevbackend.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class CartService implements ICartService {

    @Autowired
    private final CartRepository cartRepository;
    @Autowired
    private final CartItemRepository cartItemRepository;
    @Autowired
    private final ProductRepository productRepository;
    @Autowired
    private final ConsumerRepository consumerRepository;

    public CartService(CartRepository cartRepository, CartItemRepository cartItemRepository, ProductRepository productRepository, ConsumerRepository consumerRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.consumerRepository = consumerRepository;
    }

    public Cart getOrCreateCart(UUID customerUuid) {
        return cartRepository.findByConsumerUuid(customerUuid)
                .orElseGet(() -> {
                    Cart cart = new Cart();
                    Consumer customer = consumerRepository.findById(customerUuid).orElseThrow();
                    cart.setConsumer(customer);
                    return cartRepository.save(cart);
                });
    }

    public void addProductToCart(UUID customerUuid, UUID productUuid, int quantity) {
        Cart cart = getOrCreateCart(customerUuid);
        Product product = productRepository.findById(productUuid).orElseThrow();

        Optional<CartItem> existingItem = cart.getCartItems().stream()
                .filter(item -> item.getProduct().getUuid_product().equals(productUuid))
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
            cartItemRepository.save(item);
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(quantity);
            cart.getCartItems().add(newItem);
            cartItemRepository.save(newItem);
        }

        cartRepository.save(cart);
    }

    public void removeProductFromCart(UUID customerUuid, UUID productUuid) {
        Cart cart = getOrCreateCart(customerUuid);

        // Find the item to remove
        CartItem itemToRemove = cart.getCartItems().stream()
                .filter(item -> item.getProduct().getUuid_product().equals(productUuid))
                .findFirst()
                .orElse(null);

        if (itemToRemove != null) {
            cart.getCartItems().remove(itemToRemove);
            cartItemRepository.delete(itemToRemove); // Delete from DB
            cartRepository.save(cart); // Save updated cart
        }
    }


    public void clearCart(UUID customerUuid) {
        Cart cart = getOrCreateCart(customerUuid);

        // Delete all cart items associated with this cart
        cartItemRepository.deleteAll(cart.getCartItems());

        // Clear the list and save the cart
        cart.getCartItems().clear();
        cartRepository.save(cart);
    }

}
