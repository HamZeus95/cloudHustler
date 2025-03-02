package cloud.hustler.pidevbackend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@EqualsAndHashCode
@FieldDefaults(level = AccessLevel.PRIVATE)

public class Service {
    @Id
    UUID uuid;
    String title;
    String description;
    boolean isHiring;
    String category;
    double salary;
    String imageUrl;
    int nbWorkers;



    @ManyToOne
    Farmer farmer;

    @OneToMany
    List<ServiceRequests> serviceRequests;





}
