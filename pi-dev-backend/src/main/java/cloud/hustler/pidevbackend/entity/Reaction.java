package cloud.hustler.pidevbackend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;



@Entity
@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
@ToString
@FieldDefaults(level = AccessLevel.PRIVATE)

public class Reaction {

    @ManyToOne
    @JoinColumn(name = "post_uuid", nullable = false)
    Post post;


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long uuid_reaction;
    @Enumerated(EnumType.STRING)
    TypeReaction typeReaction;
}
