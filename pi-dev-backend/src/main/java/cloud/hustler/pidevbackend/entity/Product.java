package cloud.hustler.pidevbackend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@EqualsAndHashCode
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Product {
    @Id
    @GeneratedValue(strategy= GenerationType.UUID)
    UUID uuid_product;
    String name;
    String description;
    double price;
    int quantity;
    boolean isAvailable;
    String imageUrl;


    @ManyToOne
    @JoinColumn(name = "order_uuid_order")
    @JsonIgnore
    Order order;

    @ManyToOne
    @JsonIgnore
    Farmer farmer;

    @ManyToOne
    @JoinColumn(name = "product_category_uuid_category")
    ProductCategory productCategory;

    @Column(nullable = true)
    private Integer discount;

    @CreationTimestamp
    private Instant createdAt;

    private Double originalPrice;
    public void applyDiscount(int discount) {
        if (discount > 0 && discount <= 100) {
            if (this.originalPrice == null) {
                this.originalPrice = this.price; // Store original price only once
            }
            this.discount = discount;
            this.price = this.originalPrice - (this.originalPrice * discount / 100.0);
        }
    }

    public void removeDiscount() {
        if (this.originalPrice != null) {
            this.price = this.originalPrice;
            this.originalPrice = null;
            this.discount = null;
        }
    }


}
