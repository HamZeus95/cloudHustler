package cloud.hustler.pidevbackend.entity;

import jakarta.persistence.*;
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
public class Ressource {
    @Id
    @GeneratedValue(strategy= GenerationType.UUID)
    UUID uuid_ressource;
    String name;
    int Quantity;


    @ManyToOne
    ResourceCat resourceCat;

   /* @ManyToOne
    Land land;*/



}
