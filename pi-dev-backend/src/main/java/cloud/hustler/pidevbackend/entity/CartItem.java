package cloud.hustler.pidevbackend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Objects;
import java.util.UUID;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@EqualsAndHashCode
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID uuid_cartItem;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "cart_uuid")
    Cart cart;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_uuid")
    Product product;

    int quantity;

    double totalPrice() {
        return product.getPrice() * quantity;
    }


    public UUID getUuid_cartItem() {
        return uuid_cartItem;
    }

    public void setUuid_cartItem(UUID uuid_cartItem) {
        this.uuid_cartItem = uuid_cartItem;
    }

    public Cart getCart() {
        return cart;
    }

    public void setCart(Cart cart) {
        this.cart = cart;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }


    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        CartItem cartItem = (CartItem) o;
        return quantity == cartItem.quantity && Objects.equals(uuid_cartItem, cartItem.uuid_cartItem) && Objects.equals(cart, cartItem.cart) && Objects.equals(product, cartItem.product);
    }


}
