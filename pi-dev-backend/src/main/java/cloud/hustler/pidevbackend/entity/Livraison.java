package cloud.hustler.pidevbackend.entity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
//@NoArgsConstructor
@ToString
@EqualsAndHashCode
public class Livraison {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Le statut ne peut pas être nul.")
    @Pattern(regexp = "^(En attente|En transit|Livrée)$", message = "Le statut doit être 'En attente', 'En transit', 'Livrée'.")
    private String statut;

    @NotNull(message = "La date de creation ne peut pas être nulle.")
    private LocalDateTime dateCreation;

    @OneToOne(mappedBy = "livraison", cascade = CascadeType.ALL)
    private Facture facture;

    public Livraison() {
        this.dateCreation = LocalDateTime.now();
    }

    // Getter pour id
    public Long getId() {
        return id;
    }

    // Setter pour id
    public void setId(Long id) {
        this.id = id;
    }

    // Getter pour statut
    public String getStatut() {
        return statut;
    }

    // Setter pour statut
    public void setStatut(String statut) {
        this.statut = statut;
    }

    // Getter pour dateCreation
    public LocalDateTime getDateCreation() {
        return dateCreation;
    }

    // Setter pour dateCreation
    public void setDateCreation(LocalDateTime dateCreation) {
        this.dateCreation = dateCreation;
    }

    // Getter pour facture
    public Facture getFacture() {
        return facture;
    }

    // Setter pour facture
    public void setFacture(Facture facture) {
        this.facture = facture;
    }


}
