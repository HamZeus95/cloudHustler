package cloud.hustler.pidevbackend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.HashSet;
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

public class Servicee {
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
            @JsonIgnore
    Farmer farmer;

    @OneToMany(mappedBy = "servicee")
            @JsonIgnore
    Set<ServiceRequests> serviceRequests= new HashSet<>();





}
