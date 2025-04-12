package cloud.hustler.pidevbackend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;
import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
@EqualsAndHashCode
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Ressource {
    @Id
    @GeneratedValue(strategy= GenerationType.UUID)
    private UUID uuid_ressource;
    private String name;
    private double quantity;
    private String unit;
    private double cost;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "farm_id")
    private Farm farm;



}
