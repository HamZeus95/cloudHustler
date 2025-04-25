package cloud.hustler.pidevbackend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Farm {
    @EqualsAndHashCode.Include
    @Id
    @GeneratedValue(strategy= GenerationType.UUID)
    private UUID uuid_farm;
    private String name;
    private double size;
    private double latitude;
    private double longitude;
    private String irrigation_type;

    // associations
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farmer_id")
    private Farmer farmer;

    // each farm has a set of resources
    @OneToMany(mappedBy = "farm", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<Ressource> resources = new HashSet<>();

    // each farm has a set of crops
    @OneToMany(mappedBy = "farm", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<Crop> crops = new HashSet<>();

    // each farm has a set of tasks
    @OneToMany(mappedBy = "farm", cascade = CascadeType.ALL)
    private Set<Task> tasks = new HashSet<>();


    // each farm has a set of expenses
    @OneToMany(mappedBy = "farm", cascade = CascadeType.ALL)
    private Set<Expense> expenses = new HashSet<>();



    //MDA
    // Relationship management methods
    public void addCrop(Crop crop) {
        crops.add(crop);
        crop.setFarm(this);
    }

    public void removeCrop(Crop crop) {
        crops.remove(crop);
        crop.setFarm(null);
    }

    //resource
    public void addResource(Ressource ressource) {
        resources.add(ressource);
        ressource.setFarm(this);
    }

    public void removeResource(Ressource ressource) {
        resources.remove(ressource);
        ressource.setFarm(null);
    }

    //expense

    public void addExpense(Expense expense) {
        expenses.add(expense);
        expense.setFarm(this);
    }

    public void removeExpense(Expense expense) {
        expenses.remove(expense);
        expense.setFarm(null);
    }


}