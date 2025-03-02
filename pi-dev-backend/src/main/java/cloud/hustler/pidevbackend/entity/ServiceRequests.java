package cloud.hustler.pidevbackend.entity;

import jakarta.persistence.*;
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
public class ServiceRequests {
    @Id
    UUID uuid;

    @Enumerated(EnumType.STRING)
    TypeStatus status;


    @ManyToOne
    Service service;

    @ManyToMany
    List<User> users_applying;




}
