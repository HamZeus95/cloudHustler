package tn.esprit.meddhiaalaya.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Action {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idAction;
    private double prixAchatActuel;
    private double prixVenteActuel;
    private int volume;
    private LocalDate dateEmission;

    @Column(unique = true)
    private String symbole;
    @JsonIgnore
    @OneToMany(mappedBy = "action", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    List<Ordre> ordres;

}
