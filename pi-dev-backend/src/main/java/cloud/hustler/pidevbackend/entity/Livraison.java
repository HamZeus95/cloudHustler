package cloud.hustler.pidevbackend.entity;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
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
    private String statut;

    @NotNull
    private  String adresseLivraison;

    @NotNull
    private  LocalDate dateLivraison;

    @NotNull(message = "La date de creation ne peut pas être nulle.")
    private LocalDate dateCreation;



    public Livraison() {
        this.dateCreation = LocalDate.now();
    }

    // Getter pour id


    // Getter pour dateCreation
    @OneToOne
    @JoinColumn(name = "order_id") // Clé étrangère vers Order
    //@JsonIgnore
    private Order order;





    @ManyToOne
    @JoinColumn(name = "delivery_man_id") // Clé étrangère vers DeliveryMan
    private DeliveryDriver deliveryDriver;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }

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

    public LocalDate getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(LocalDate dateCreation) {
        this.dateCreation = dateCreation;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public DeliveryDriver getDeliveryDriver() {
        return deliveryDriver;
    }

    public void setDeliveryDriver(DeliveryDriver deliveryDriver) {
        this.deliveryDriver = deliveryDriver;
    }
}
