package cloud.hustler.pidevbackend.entity;

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
public class ServiceRequests {
    @Id
    @GeneratedValue(strategy= GenerationType.UUID)
    UUID uuid_serviceRequest;

    @Enumerated(EnumType.STRING)
    TypeStatus status;

    String lettreMotivation;
    String uploadCv;

    @ManyToOne
    Servicee servicee;

    @ManyToMany(mappedBy = "serviceRequests")
    Set<User> users_applying= new HashSet<>();




}
