package cloud.hustler.pidevbackend.controllers;

import cloud.hustler.pidevbackend.dto.QuestionDto;
import cloud.hustler.pidevbackend.dto.QuizDTO;
import cloud.hustler.pidevbackend.entity.Answer;
import cloud.hustler.pidevbackend.entity.Question;
import cloud.hustler.pidevbackend.entity.Quiz;
import cloud.hustler.pidevbackend.entity.Servicee;
import cloud.hustler.pidevbackend.repository.AnswerRepository;
import cloud.hustler.pidevbackend.repository.QuestionRepository;
import cloud.hustler.pidevbackend.repository.QuizRepository;
import cloud.hustler.pidevbackend.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/quiz")
 public class QuizController {

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private AnswerRepository answerRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    // ==================== QUIZ ====================

    @GetMapping
    public List<Quiz> getAllQuizzes() {
        return quizRepository.findAll();
    }

    @GetMapping("/byServiceId/{id}")
    public Quiz getQuizByServiceId(@PathVariable String id) {
        Servicee s=serviceRepository.getById(UUID.fromString(id));
        return quizRepository.findByService(s).orElse(null);
    }

    @GetMapping("/{id}")
    public Quiz getQuizById(@PathVariable String id) {
        return quizRepository.findById(id).orElse(null);
    }


    @PostMapping("/{serviceeId}")
    public Quiz createQuiz(@PathVariable String serviceeId,@RequestBody QuizDTO quiz) {
        Servicee s=serviceRepository.getById(UUID.fromString(serviceeId));
        Quiz q=new Quiz();
        q.setService(s);
        q.setTitle(quiz.getTitle());
        q.setDescription(quiz.getDescription()
        );

        return quizRepository.save(q);
    }

    @PutMapping("/{id}")
    public Quiz updateQuiz(@PathVariable String id, @RequestBody Quiz quizDetails) {
        Quiz quiz = quizRepository.findById(id).orElse(null);
        if (quiz != null) {
            quiz.setTitle(quizDetails.getTitle());
            quiz.setDescription(quizDetails.getDescription());
            return quizRepository.save(quiz);
        }
        return null;
    }

    @DeleteMapping("/{id}")
    public void deleteQuiz(@PathVariable String id) {
        quizRepository.deleteById(id);
    }

    // ==================== QUESTION ====================

    @PostMapping("/{quizId}/questions")
    public Question addQuestionToQuiz(@PathVariable String quizId, @RequestBody QuestionDto questionDto) {
        Quiz quiz = quizRepository.findById(quizId).orElse(null);
        Question question=new Question();

        if (quiz != null) {
            question.setQuiz(quiz);
            question.setQuestionText(questionDto.getQuestionText());
             Question q= questionRepository.save(question);
            for(String answer: questionDto.getAnswers()) {
                Answer a=new Answer();
                a.setAnswerText(answer);
                a.setQuestion(q);
                Answer newAnswer=answerRepository.save(a);
                if(questionDto.getCorrectAnswer().equals(answer)) {
                    q.setCorrectAnswer(newAnswer);
                    questionRepository.save(q);
                }
            }
            return q;
        }
        return null;
    }

    @GetMapping("/{quizId}/questions")
    public List<Question> getQuestionsForQuiz(@PathVariable String quizId) {
        return questionRepository.findByQuizId(quizId);
    }

    @DeleteMapping("/questions/{questionId}")
    public void deleteQuestion(@PathVariable String questionId) {
        questionRepository.deleteById(questionId);
    }

    // ==================== ANSWER ====================

    @PostMapping("/questions/{questionId}/answers")
    public Answer addAnswerToQuestion(@PathVariable String questionId, @RequestBody Answer answer) {
        Question question = questionRepository.findById(questionId).orElse(null);
        if (question != null) {
            answer.setQuestion(question);
            return answerRepository.save(answer);
        }
        return null;
    }

    @GetMapping("/questions/{questionId}/answers")
    public List<Answer> getAnswersForQuestion(@PathVariable String questionId) {
        return answerRepository.findByQuestionId(questionId);
    }

    @DeleteMapping("/answers/{answerId}")
    public void deleteAnswer(@PathVariable String answerId) {
        answerRepository.deleteById(answerId);
    }

    // ==================== CORRECT ANSWER ====================

    @PutMapping("/questions/{questionId}/correctAnswer/{answerId}")
    public Question setCorrectAnswer(@PathVariable String questionId, @PathVariable String answerId) {
        Question question = questionRepository.findById(questionId).orElse(null);
        Answer answer = answerRepository.findById(answerId).orElse(null);
        if (question != null && answer != null) {
            question.setCorrectAnswer(answer);
            return questionRepository.save(question);
        }
        return null;
    }
}
