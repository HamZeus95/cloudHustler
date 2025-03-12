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

public class Crop {
    @Id
    @GeneratedValue(strategy= GenerationType.UUID)
    private UUID uuid_crop;
    private String name;
    private LocalDate plantingDate;
    private LocalDate harvestDate;
    private double expectedYield;

    //les relations
    @ManyToOne
    @JoinColumn(name = "farm_id")
    private Farm farm;




}
