package cloud.hustler.pidevbackend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
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
    @GeneratedValue(strategy= GenerationType.UUID)
    UUID uuid_service;
    String title;
    String description;
    boolean isHiring;
    String category;
    double salary;
    String imageUrl;
    int nbWorkers;



    @ManyToOne
    Farmer farmer;

    @OneToMany(mappedBy = "service")
    Set<ServiceRequests> serviceRequests= new HashSet<>();





}
