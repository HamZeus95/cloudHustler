package cloud.hustler.pidevbackend.entity;

import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;
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
public class Post {
    @Id
    UUID uuid;
    String title;
    String content;
    String image;
    String video;
    Date createdAt;
    Date updatedAt;
    // int likes;



    @ManyToOne
    Farmer farmer;

    @OneToMany(mappedBy = "post")
    List<Comment> comments;




}
