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
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Crop {
    @EqualsAndHashCode.Include
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID uuid_crop;
    private String name;
    private LocalDate plantingDate;
    private LocalDate harvestDate;
    private double expectedYield;
    private double waterRequirement; // New for optimization
    private double fertilizerRequirement; // New for optimization
    private String diseaseSusceptibility; // New for disease detection

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    @JoinColumn(name = "farm_id")
    private Farm farm;

    // Existing setters with relationship management
    public void setFarm(Farm farm) {
        if (this.farm != null) {
            this.farm.getCrops().remove(this);
        }
        this.farm = farm;
        if (farm != null && !farm.getCrops().contains(this)) {
            farm.getCrops().add(this);
        }
    }
}




