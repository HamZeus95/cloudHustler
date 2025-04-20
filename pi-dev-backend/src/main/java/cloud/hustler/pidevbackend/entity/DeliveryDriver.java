package cloud.hustler.pidevbackend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@FieldDefaults(level = AccessLevel.PRIVATE)

public class DeliveryDriver extends User {

    boolean isAvailable;
    @OneToMany(mappedBy = "deliveryDriver") // Un livreur a plusieurs livraisons
    private List<Livraison> livraisons = new ArrayList<>();

}
