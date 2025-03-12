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
public class SuiviLivraison {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "livraison_id", nullable = false)
    private Livraison livraison;

    @NotNull(message = "Le statut ne peut pas être nul.")
    @Pattern(regexp = "^(Préparée|En transit|Livrée)$", message = "Le statut doit être 'Préparée', 'En transit', 'Livrée'.")
    private String statut; // "Préparée", "En transit", "Livrée"

    private String commentaire;

    @NotNull(message = "La date ne peut pas être nulle.")
    private LocalDateTime dateMaj;

    public SuiviLivraison() {
        this.dateMaj = LocalDateTime.now();
    }
    // Getter pour id
    public Long getId() {
        return id;
    }

    // Setter pour id
    public void setId(Long id) {
        this.id = id;
    }

    // Getter pour livraison
    public Livraison getLivraison() {
        return livraison;
    }

    // Setter pour livraison
    public void setLivraison(Livraison livraison) {
        this.livraison = livraison;
    }

    // Getter pour statut
    public String getStatut() {
        return statut;
    }

    // Setter pour statut
    public void setStatut(String statut) {
        this.statut = statut;
    }

    // Getter pour commentaire
    public String getCommentaire() {
        return commentaire;
    }

    // Setter pour commentaire
    public void setCommentaire(String commentaire) {
        this.commentaire = commentaire;
    }

    // Getter pour dateMaj
    public LocalDateTime getDateMaj() {
        return dateMaj;
    }

    // Setter pour dateMaj
    public void setDateMaj(LocalDateTime dateMaj) {
        this.dateMaj = dateMaj;
    }
}