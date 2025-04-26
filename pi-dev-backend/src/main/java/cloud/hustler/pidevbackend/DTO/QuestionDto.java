package cloud.hustler.pidevbackend.DTO;

import lombok.Data;

import java.util.List;

@Data
public class QuestionDto {
    private String questionText;
    private List<String> answers;
    private String correctAnswer;
}
