package cloud.hustler.pidevbackend.repository;

import cloud.hustler.pidevbackend.entity.Question;
 import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepository  extends JpaRepository<Question, String> {
    List<Question> findByQuizId(String quizId);

}
