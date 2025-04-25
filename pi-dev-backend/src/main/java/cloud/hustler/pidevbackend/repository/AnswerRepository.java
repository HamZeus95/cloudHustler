package cloud.hustler.pidevbackend.repository;

import cloud.hustler.pidevbackend.entity.Answer;
import cloud.hustler.pidevbackend.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AnswerRepository  extends JpaRepository<Answer, String> {
    List<Answer> findByQuestionId(String questionId);

}
