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
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    long uuid_post;
    String title;
    String content;
    String mediaUrl;

    Date createdAt;

    Date updatedAt;






    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    Set<Comment> comments= new HashSet<>();

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    Set<Reaction> reactions= new HashSet<>();




}
