package cloud.hustler.pidevbackend.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserNotConsumerDTO {
    UUID userUUID;
    String firstName;
    String lastName;
    String profileImage;
}
