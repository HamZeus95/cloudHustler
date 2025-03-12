package cloud.hustler.pidevbackend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@EqualsAndHashCode
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductCategory {

    @Id
    @GeneratedValue(strategy= GenerationType.UUID)
    UUID uuid_category;
    String name;
    String description;


    @OneToMany(mappedBy = "productCategory")
    @ToString.Exclude
    @JsonIgnore
    Set<Product> products = new HashSet<>();


    public UUID getUuid_category() {
        return uuid_category;
    }

    public void setUuid_category(UUID uuid_category) {
        this.uuid_category = uuid_category;
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

    public Set<Product> getProducts() {
        return products;
    }

    public void setProducts(Set<Product> products) {
        this.products = products;
    }
}
