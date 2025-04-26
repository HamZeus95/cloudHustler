package cloud.hustler.pidevbackend.DTO;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@EqualsAndHashCode
public class ServiceRequestRequestBody {
    private String uploadCv;
    private String lettreMotivation;
    private UUID serviceId;

}
