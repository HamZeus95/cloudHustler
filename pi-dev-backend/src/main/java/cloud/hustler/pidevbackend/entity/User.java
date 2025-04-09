package cloud.hustler.pidevbackend.entity;


import jakarta.persistence.*;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.*;

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
    @GeneratedValue(strategy= GenerationType.UUID)
    UUID uuid_user;
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








}
