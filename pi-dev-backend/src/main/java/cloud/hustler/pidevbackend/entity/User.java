package cloud.hustler.pidevbackend.entity;


import jakarta.persistence.*;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;
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
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(columnNames = "email")  // 👈 Ensures unique email at DB level
})

public abstract class User {
    @Id
    UUID uuid;
    String firstName;
    String lastName;
    Date birthDate;
    @Column(unique = true, nullable = false)
    String email;
    String password;
    String image;
    String phone;
    String address;
    boolean isActif;


    @ManyToMany
    List<ServiceRequests> serviceRequests;



}
