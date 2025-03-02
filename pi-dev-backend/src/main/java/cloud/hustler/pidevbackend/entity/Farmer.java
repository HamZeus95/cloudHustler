package cloud.hustler.pidevbackend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@FieldDefaults(level = AccessLevel.PRIVATE)

public class Farmer extends User {

    int experience;

    @OneToMany(mappedBy = "farmer")
    List<Post> posts;

    @OneToMany(mappedBy = "farmer")
    List<Service> services;

    @OneToMany(mappedBy = "farmer")
    List<Land> lands;

    @OneToMany
    List<Product> products;


}
