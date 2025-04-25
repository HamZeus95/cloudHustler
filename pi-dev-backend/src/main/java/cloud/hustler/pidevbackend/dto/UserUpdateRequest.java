package cloud.hustler.pidevbackend.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserUpdateRequest {
    String firstName;
    String lastName;
    String phone;
    String address;
    
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    Date birthDate;
    
    // Used for file uploads
    MultipartFile imageFile;
}