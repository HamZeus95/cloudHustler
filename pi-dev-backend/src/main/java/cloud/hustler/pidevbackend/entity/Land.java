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
public class Land {
    @Id
    UUID uuid;
    String name;
    Double size;
    Double latitude;
    Double longitude;


    @ManyToOne
    Farmer farmer;


}
