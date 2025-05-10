package tn.esprit.meddhiaalaya.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Ordre {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idOrdre;
    private int volume;
    private LocalDate dateCreation;
    private LocalDate dateExecution;
    private double montant;
    @Enumerated(EnumType.STRING)
     Status status;
    @Enumerated(EnumType.STRING)
    Type typeOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    Action action;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    Portefeuille portefeuille;






}
