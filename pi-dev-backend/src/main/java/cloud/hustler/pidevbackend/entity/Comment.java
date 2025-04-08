package cloud.hustler.pidevbackend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

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
    UUID uuid_comment;
    String content;
    Date createdAt;
    Date updatedAt;


    @ManyToOne
    Post post;




}
