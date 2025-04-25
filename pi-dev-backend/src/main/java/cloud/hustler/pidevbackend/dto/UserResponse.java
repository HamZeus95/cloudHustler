package cloud.hustler.pidevbackend.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    UUID userUUID;
    String email;
    String firstName;
    String lastName;
    Date birthDate;
    String image;
    String phone;
    String address;
    String Role;
    boolean isActif;
}
