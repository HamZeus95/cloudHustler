package tn.esprit.boycott.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Set;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Utilisateur {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String email;
    private LocalDate dateInscri;
    @Enumerated(EnumType.STRING)
    private TypeUtilisateur typeUtilisateur;

    @JsonIgnore
    @OneToMany(cascade = CascadeType.ALL)
    private Set<Produit> produits;





}
