package cloud.hustler.pidevbackend.dto;

import cloud.hustler.pidevbackend.entity.TypeSpeciality;
import jakarta.persistence.Column;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RegisterRequest {
    String firstName;
    String lastName;
    Date birthDate;
    String email;
    String password;
    String image;
    String phone;
    String address;
    // may contain yearsofexperience and may not contain it
    //expert
    int yearsOfExperience;
    TypeSpeciality typeSpeciality;
    // Farmer
    int experience;
    // DeliveryMan
    boolean available; // Changed from isAvailable to available to match Java Bean naming convention
    String role;

}
