
package cloud.hustler.pidevbackend.dto;


import lombok.Data;

import java.util.List;

@Data
public class QuestionDto {
    private String questionText;
    private List<String> answers;
    private String correctAnswer;
}
