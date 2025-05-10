package tn.esprit.meddhiaalaya.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ElementPortefeuille {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idElement;
    private String symbole;
    private int nombreActions;
    private double prixAchat;
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    Portefeuille portefeuille;



}
