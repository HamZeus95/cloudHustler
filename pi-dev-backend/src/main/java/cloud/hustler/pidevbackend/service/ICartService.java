package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.entity.Cart;

import java.util.UUID;

public interface ICartService {
    Cart getOrCreateCart(UUID customerUuid);
    void addProductToCart(UUID customerUuid, UUID productUuid, int quantity);
    void removeProductFromCart(UUID customerUuid, UUID productUuid);
    void clearCart(UUID customerUuid);
}
