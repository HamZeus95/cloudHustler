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

public class Expense {
    @Id
    @GeneratedValue(strategy= GenerationType.UUID)
    private UUID uuid_expense;
    // Medical, Feed, Shelter, Equipment, etc  **** y n7otha enum walla nkhalleha string
    private String expenseType;
    private double amount;
    private LocalDate date;
    private String description;



    @ManyToOne
    @JoinColumn(name = "farm_id", nullable = true)
    private Farm farm;



}
