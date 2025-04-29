package cloud.hustler.pidevbackend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.CascadeType;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@FieldDefaults(level = AccessLevel.PRIVATE)
@DiscriminatorValue("Farmer")
public class Farmer extends User {

    int experience;


    @OneToMany(mappedBy = "farmer")
    @JsonIgnore
    Set<Servicee> servicees = new HashSet<>();

    @OneToMany(mappedBy = "farmer", cascade = CascadeType.ALL)
    Set<Farm> farms= new HashSet<>();

    @OneToMany(mappedBy = "farmer")
    Set<Product> products= new HashSet<>();


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public String getUsername() {
        return super.getEmail();
    }

    @Override
    public  String getPassword() {
        return super.getPassword();
    }

    @Override
    public boolean isAccountNonExpired() {
        return super.isAccountNonExpired();
    }

    @Override
    public boolean isAccountNonLocked() {
        return super.isAccountNonLocked();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return super.isCredentialsNonExpired();
    }

    @Override
    public boolean isEnabled() {
        return super.isEnabled();
    }
}
