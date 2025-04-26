package cloud.hustler.pidevbackend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Data
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
    @Column(columnDefinition = "TEXT")
    String description;
    String location;
    String banner;
    LocalDate startDate;
    String endDate;
    int maxParticipants;
    private boolean isOnline; 
    private String onlineLink;
    String ImageUrl;
    @ElementCollection
    List<String> imgsUrls;
    @ElementCollection
    List<String> participants = new ArrayList<>();

    @ManyToOne
    @JsonIgnore
    Expert expert;




}