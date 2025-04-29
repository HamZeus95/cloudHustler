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
    @Column(name = "uuid_category")
    UUID uuid_category;
    String name;
    String description;


    @OneToMany(mappedBy = "productCategory")
    @ToString.Exclude
    @JsonIgnore
    Set<Product> products = new HashSet<>();



}
