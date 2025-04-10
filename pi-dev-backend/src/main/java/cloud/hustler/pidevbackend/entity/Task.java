package cloud.hustler.pidevbackend.entity;

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
    private taskStatus status;
    private LocalDate startDate;
    private LocalDate endDate;

    //les relations

    @ManyToOne
    @JoinColumn(name = "farm_id")
    private Farm farm;





}
