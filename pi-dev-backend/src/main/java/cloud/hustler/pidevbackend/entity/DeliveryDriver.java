package cloud.hustler.pidevbackend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Transient;
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
    @Transient // ne sera pas stocké dans la BDD
    private String positionLivreur;


    public String getPositionLivreur() {
        return positionLivreur;
    }

    public void setPositionLivreur(String positionLivreur) {
        this.positionLivreur = positionLivreur;
    }
}
