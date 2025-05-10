package tn.esprit.meddhiaalaya.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Portefeuille {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idPortefeuille;

    @Column(unique = true)
    private int reference;
    private double solde;
    @JsonIgnore
    @OneToMany(mappedBy = "portefeuille", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    List<Ordre> ordres;

    @OneToMany(mappedBy = "portefeuille", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    List<ElementPortefeuille> elements;

}
