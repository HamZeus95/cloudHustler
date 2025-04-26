package cloud.hustler.pidevbackend.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.UUID;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@EqualsAndHashCode
@FieldDefaults(level = AccessLevel.PRIVATE)

public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID uuid_orderItem;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "order_uuid")
    Order order;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_uuid")
    Product product;

    int quantity;

    double totalPrice() {
        return product.getPrice() * quantity;
    }


    public UUID getUuid_orderItem() {
        return uuid_orderItem;
    }

    public void setUuid_orderItem(UUID uuid_orderItem) {
        this.uuid_orderItem = uuid_orderItem;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
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
}
