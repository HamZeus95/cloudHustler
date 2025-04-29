package cloud.hustler.pidevbackend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.util.Date;
import java.util.UUID;



@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@EqualsAndHashCode
@FieldDefaults(level = AccessLevel.PRIVATE)

public class Comment {

    @Id
    @GeneratedValue(strategy= GenerationType.UUID)
    UUID commentId;
    String content;

    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    Date createdAt;

    @UpdateTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    Date updatedAt;


    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "post_uuid", nullable = false)
    Post post;


    @ManyToOne
    @JsonIgnore

    @JoinColumn(name = "user_id")
    private User user;  // Relation avec le Farmer qui a écrit ce post






}
