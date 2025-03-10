package cloud.hustler.pidevbackend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

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
    Set<Service> services= new HashSet<>();

    @OneToMany(mappedBy = "farmer")
    Set<Land> lands= new HashSet<>();

    @OneToMany(mappedBy = "farmer")
    Set<Product> products= new HashSet<>();


}
