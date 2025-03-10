package cloud.hustler.pidevbackend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.HashSet;
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
public class Land {
    @Id
    @GeneratedValue(strategy= GenerationType.UUID)
    UUID uuid_land;
    String name;
    Double size;
    Double latitude;
    Double longitude;


    @ManyToOne
    Farmer farmer;

    @OneToMany(mappedBy = "land")
    Set<Ressource> ressources = new HashSet<>();


}
