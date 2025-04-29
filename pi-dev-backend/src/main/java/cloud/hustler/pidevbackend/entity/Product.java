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

    public UUID getUuid_product() {
        return uuid_product;
    }

    public void setUuid_product(UUID uuid_product) {
        this.uuid_product = uuid_product;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public boolean isAvailable() {
        return isAvailable;
    }

    public void setAvailable(boolean available) {
        isAvailable = available;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public Farmer getFarmer() {
        return farmer;
    }

    public void setFarmer(Farmer farmer) {
        this.farmer = farmer;
    }

    public ProductCategory getProductCategory() {
        return productCategory;
    }

    public void setProductCategory(ProductCategory productCategory) {
        this.productCategory = productCategory;
    }

    public Integer getDiscount() {
        return discount;
    }

    public void setDiscount(Integer discount) {
        this.discount = discount;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Double getOriginalPrice() {
        return originalPrice;
    }

    public void setOriginalPrice(Double originalPrice) {
        this.originalPrice = originalPrice;
    }
}
