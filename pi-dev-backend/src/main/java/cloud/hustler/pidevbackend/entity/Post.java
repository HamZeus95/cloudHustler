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
public class Post {
    @Id
    @GeneratedValue(strategy= GenerationType.UUID)
    UUID uuid_post;
    String title;
    String content;
    String image;
    String video;
    Date createdAt;
    Date updatedAt;
    int likes;



    @ManyToOne
    User user;

    @OneToMany(mappedBy = "post")
    Set<Comment> comments= new HashSet<>();





}
