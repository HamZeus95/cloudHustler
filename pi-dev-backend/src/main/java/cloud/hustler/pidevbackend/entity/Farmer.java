package cloud.hustler.pidevbackend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.HashSet;
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
    Set<Servicee> servicees = new HashSet<>();

    @OneToMany(mappedBy = "farmer")
    Set<Farm> lands= new HashSet<>();

    @OneToMany(mappedBy = "farmer")
    Set<Product> products= new HashSet<>();


}
