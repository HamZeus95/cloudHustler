package cloud.hustler.pidevbackend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.util.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@EqualsAndHashCode
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Post {
    @Id
    @GeneratedValue(strategy= GenerationType.UUID)
    UUID uuid_post;
    String title;
    String content;
    String mediaUrl;
    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    Date createdAt;
    @UpdateTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    Date updatedAt;




    @ManyToOne
    User user;

    @OneToMany(mappedBy = "post")
    Set<Comment> comments= new HashSet<>();

    @OneToMany(mappedBy = "post")
    Set<Reaction> reactions= new HashSet<>();




}
