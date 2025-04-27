package cloud.hustler.pidevbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FaceIdRequest {
    private String userId;
    private String imageBase64;
}