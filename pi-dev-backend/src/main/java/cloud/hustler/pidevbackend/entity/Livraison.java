package cloud.hustler.pidevbackend.entity;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.*;

import java.time.LocalDate;
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

    @NotNull
    private  String adresseLivraison;

    @NotNull
    private  LocalDate dateLivraison;

    @NotNull(message = "La date de creation ne peut pas être nulle.")
    private LocalDate dateCreation;

    /*@OneToOne(mappedBy = "livraison", cascade = CascadeType.ALL)
    @JsonBackReference
    private Facture facture;*/

    public Livraison() {
        this.dateCreation = LocalDate.now();
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
    public LocalDate getDateCreation() {
        return dateCreation;
    }

    // Setter pour dateCreation
    public void setDateCreation(LocalDate dateCreation) {
        this.dateCreation = dateCreation;
    }

    // Getter pour facture

    public String getAdresseLivraison() {
        return adresseLivraison;
    }

    public void setAdresseLivraison(String adresseLivraison) {
        this.adresseLivraison = adresseLivraison;
    }

    public LocalDate getDateLivraison() {
        return dateLivraison;
    }

    public void setDateLivraison(LocalDate dateLivraison) {
        this.dateLivraison = dateLivraison;
    }
   /* public Facture getFacture() {
        return facture;
    }

    // Setter pour facture
    public void setFacture(Facture facture) {
        this.facture = facture;
    }*/


}
