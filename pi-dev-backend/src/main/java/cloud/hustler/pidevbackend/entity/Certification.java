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
public class Certification {
    @Id
    @GeneratedValue(strategy= GenerationType.UUID)
    UUID uuid_certification;
    String name;
    String description;
    String image;
    Date startDate;
    Date endDate;

    @ManyToOne
    Expert expert;





}