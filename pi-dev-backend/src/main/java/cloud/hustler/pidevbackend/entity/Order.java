package cloud.hustler.pidevbackend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@EqualsAndHashCode
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "`order`")
public class Order {
    @Id
    @GeneratedValue(strategy= GenerationType.UUID)
    UUID uuid_order;
    double TotalPrice;
    String status;
    String paymentMethod;


    @OneToMany(mappedBy = "order")
    Set<Product> products= new HashSet<>();

    @ManyToOne
    Consumer consumer;



}
