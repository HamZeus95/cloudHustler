package tn.esprit.boycott.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Produit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nomProduit;
    @Enumerated(EnumType.STRING)
    private Etat etat;

    @ManyToMany(cascade = CascadeType.ALL)
    private Set<Categorie> categories;

}
