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

public class Expense {
    @Id
    @GeneratedValue(strategy= GenerationType.UUID)
    private UUID uuid_expense;
    // Medical, Feed, Shelter, Equipment, i will make enumr or let it like that
    private String expenseType;
    private double amount;
    private LocalDate date;
    private String description;


    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "farm_id")
    private Farm farm;



}
