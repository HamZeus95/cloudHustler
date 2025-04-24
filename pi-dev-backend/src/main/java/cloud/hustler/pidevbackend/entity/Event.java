package cloud.hustler.pidevbackend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

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
public class Event {
    @Id
    @GeneratedValue(strategy= GenerationType.UUID)
    UUID uuid_event;
    String name;
    String description;
    String location;
    String banner;
    String startDate;
    String endDate;
    @ElementCollection
    List<String> imgsUrls;


    @ManyToOne
    Expert expert;




}