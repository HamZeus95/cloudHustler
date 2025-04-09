package cloud.hustler.pidevbackend.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import jakarta.validation.constraints.*;

import java.time.LocalDate;
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@EqualsAndHashCode
public class Facture {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotNull(message = "La date d'émission ne peut pas être nulle.")
    private LocalDate dateEmission;


    @NotNull(message = "Le montant total ne peut pas être nul.")
    @Min(value = 0, message = "Le montant total doit être positif.")
    private Double montantTotal;

    @NotNull(message = "Le statut ne peut pas être nul.")
    @Pattern(regexp = "^(PAYÉ|EN ATTENTE|ANNULÉ)$", message = "Le statut doit être 'PAYÉ', 'EN ATTENTE' ou 'ANNULÉ'.")
    private String statut; // "PAYÉ", "EN ATTENTE", "ANNULÉ"

    @OneToOne(cascade = CascadeType.PERSIST)  // Retirer CascadeType.ALL pour éviter de supprimer la livraison avec la facture
    @JoinColumn(name = "livraison_id")
    @NotNull(message = "La livraison ne peut pas être nulle.")
    private Livraison livraison;



    // Getter pour id
    public Long getId() {
        return id;
    }

    // Setter pour id
    public void setId(Long id) {
        this.id = id;
    }

    // Getter pour dateEmission
    public LocalDate getDateEmission() {
        return dateEmission;
    }

    // Setter pour dateEmission
    public void setDateEmission(LocalDate dateEmission) {
        this.dateEmission = dateEmission;
    }

    // Getter pour montantTotal
    public Double getMontantTotal() {
        return montantTotal;
    }

    // Setter pour montantTotal
    public void setMontantTotal(Double montantTotal) {
        this.montantTotal = montantTotal;
    }

    // Getter pour statut
    public String getStatut() {
        return statut;
    }

    // Setter pour statut
    public void setStatut(String statut) {
        this.statut = statut;
    }

    // Getter pour livraison
    public Livraison getLivraison() {
        return livraison;
    }

    // Setter pour livraison
    public void setLivraison(Livraison livraison) {
        this.livraison = livraison;
    }



}
