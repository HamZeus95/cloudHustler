package cloud.hustler.pidevbackend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
@EqualsAndHashCode
public class Task {
    @Id
    @GeneratedValue(strategy= GenerationType.UUID)
    private UUID uuid_task;
    private String title;
    private String description;
    @Enumerated(EnumType.STRING)
    private TypeStatus status;
    private LocalDate startDate;
    private LocalDate endDate;



    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "farm_id")
    private Farm farm;





}
