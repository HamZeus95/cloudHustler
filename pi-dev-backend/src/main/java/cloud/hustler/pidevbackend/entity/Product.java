package cloud.hustler.pidevbackend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
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
public class Product {
    @Id
    UUID uuid;
    String name;
    String description;
    double price;
    int quantity;
    boolean isAvailable;
    String imageUrl;


    @ManyToOne
    Order order;

    @ManyToOne
    Farmer farmer;

    @ManyToOne
    ProductCategory productCategory;



}
