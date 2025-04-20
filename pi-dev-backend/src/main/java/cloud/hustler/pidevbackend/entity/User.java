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


    @ManyToMany
    Set<ServiceRequests> serviceRequests= new HashSet<>();

    @OneToMany(mappedBy = "user")
    Set<Post> posts = new HashSet<>();

    public UUID getUuid_user() {
        return uuid_user;
    }

    public void setUuid_user(UUID uuid_user) {
        this.uuid_user = uuid_user;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public Date getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(Date birthDate) {
        this.birthDate = birthDate;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public boolean isActif() {
        return isActif;
    }

    public void setActif(boolean actif) {
        isActif = actif;
    }
}
