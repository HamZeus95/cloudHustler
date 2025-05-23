package cloud.hustler.pidevbackend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

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
    @JsonIgnore
    @JoinColumn(name = "post_uuid", nullable = false)
    Post post;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;  // Relation avec le Farmer qui a écrit ce post


    @Id
    @GeneratedValue(strategy= GenerationType.UUID)
    UUID reactionId;
    @Enumerated(EnumType.STRING)
    TypeReaction typeReaction;
}