package cloud.hustler.pidevbackend.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@EqualsAndHashCode
@FieldDefaults(level = AccessLevel.PRIVATE)
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "role")
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(columnNames = "email")  // 👈 Ensures unique email at DB level
})
@SuperBuilder
public abstract class User implements UserDetails {
    @Id
    @GeneratedValue(strategy= GenerationType.UUID)
    UUID uuid_user;
    String firstName;
    String lastName;
    Date birthDate;
    @Column(unique = true, nullable = false)
    String email;
    @Column(nullable = true) // nullable for OAuth2 users
    String password;
    String image;
    String phone;
    String address;
    // default value is true in database
    @Column(columnDefinition = "boolean default False")
    boolean isActif;

    // OAuth2 related fields
    String provider; // "google", "github", etc.
    String providerId; // ID from the OAuth2 provider


    @ManyToMany
    Set<ServiceRequests> serviceRequests= new HashSet<>();

    @OneToMany(mappedBy = "user")
    Set<Post> posts = new HashSet<>();
    /*
      @OneToMany(mappedBy = "user")
      @JsonIgnore
      Set<Token> tokens = new HashSet<>();
  */
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    Set<Otp> otps = new HashSet<>();

    @Transient
    public String getRole(){
        DiscriminatorValue discriminator = this.getClass().getAnnotation(DiscriminatorValue.class);
        return (discriminator != null) ? discriminator.value() : "Consumer";
    }

}