package cloud.hustler.pidevbackend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;


import java.util.*;

@Entity

@Getter
@Setter
@AllArgsConstructor
@ToString
@EqualsAndHashCode

@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Post {
    @Id
    @GeneratedValue(strategy= GenerationType.UUID)
    UUID idPost;
    String title;
    String content;
    String mediaUrl;

    Date createdAt;

    Date updatedAt;






    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
            @JsonIgnore
    Set<Comment> comments= new HashSet<>();

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
  @JsonIgnore
    Set<Reaction> reactions= new HashSet<>();


    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "user_id")
    private User user;  // Relation avec le Farmer qui a écrit ce post


    public UUID getPosterId() {
      return user != null ? user.getUuid_user() : null;
  }



}
