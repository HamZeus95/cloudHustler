package cloud.hustler.pidevbackend.controllers;

import cloud.hustler.pidevbackend.entity.Cart;
import cloud.hustler.pidevbackend.service.CartService;
import cloud.hustler.pidevbackend.service.ICartService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
public class CartController {

    @Autowired
    ICartService cartService;

    @GetMapping("/{customerUuid}")
    public Cart getCart(@PathVariable UUID customerUuid) {
        return cartService.getOrCreateCart(customerUuid);
    }

    @PostMapping("/{customerUuid}/add")
    public void addToCart(
            @PathVariable UUID customerUuid,
            @RequestParam UUID productUuid,
            @RequestParam int quantity
    ) {
        cartService.addProductToCart(customerUuid, productUuid, quantity);
    }

    @DeleteMapping("/{customerUuid}/remove")
    public void removeFromCart(
            @PathVariable UUID customerUuid,
            @RequestParam UUID productUuid
    ) {
        cartService.removeProductFromCart(customerUuid, productUuid);
    }

    @DeleteMapping("/{customerUuid}/clear")
    public void clearCart(@PathVariable UUID customerUuid) {
        cartService.clearCart(customerUuid);
    }
}
