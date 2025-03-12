package cloud.hustler.pidevbackend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

import java.util.Date;
import java.util.UUID;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@EqualsAndHashCode

public class Report {
    @Id
    @GeneratedValue(strategy= GenerationType.UUID)
    UUID uuid_report;
    String type;
    String data;
    Date created_at;




}
