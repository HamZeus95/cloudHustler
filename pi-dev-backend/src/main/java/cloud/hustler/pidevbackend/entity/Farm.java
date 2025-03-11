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
public class Farm {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    UUID uuid;
    String name;
    Double size;
    Double latitude;
    Double longitude;



    @ManyToOne
    Farmer farmer;


}
