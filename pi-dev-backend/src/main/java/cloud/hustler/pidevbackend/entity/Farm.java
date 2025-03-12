package cloud.hustler.pidevbackend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;


@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
@EqualsAndHashCode
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Farm {
    @Id
    @GeneratedValue(strategy= GenerationType.UUID)
    private UUID uuid_farm;
    private String name;
    private double size;
    private double latitude;
    private double longitude;
    private String irrigation_type;

    //associations
    @ManyToOne
    @JoinColumn(name = "farmer_id")
    private Farmer farmer;

    @OneToMany(mappedBy = "farm", cascade = CascadeType.ALL)
    private Set<Ressource> resources=new HashSet<>();


    @OneToMany(mappedBy = "farm", cascade = CascadeType.ALL)
    private Set<Crop> crops=new HashSet<>();

    @OneToMany(mappedBy = "farm", cascade = CascadeType.ALL)
    private Set<Task> tasks=new HashSet<>();

    //@OneToMany(mappedBy = "farm", cascade = CascadeType.ALL)
    //private Set<Livestock> livestock;

    @OneToMany(mappedBy = "farm", cascade = CascadeType.ALL)
    private Set<Expense> expenses=new HashSet<>();


}
