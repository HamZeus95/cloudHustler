package cloud.hustler.pidevbackend.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.UUID;
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "uuid_orderItem")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID uuid_orderItem;

    @ManyToOne()
    @JsonIgnore
    @JoinColumn(name = "order_uuid")
    Order order;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_uuid")
    Product product;

    int quantity;

    public double getTotalPrice() {
        return product.getPrice() * quantity;
    }
}
