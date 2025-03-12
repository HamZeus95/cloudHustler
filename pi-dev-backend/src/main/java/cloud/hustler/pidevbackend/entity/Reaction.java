package cloud.hustler.pidevbackend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;


@Entity
@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
@ToString
@FieldDefaults(level = AccessLevel.PRIVATE)

public class Reaction {

    @ManyToOne
    Post post;
    @ManyToOne
    User user;

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID uuid_Reaction;
    @Enumerated(EnumType.STRING)
    TypeReaction typeReaction;
}
