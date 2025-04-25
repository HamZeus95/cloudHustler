package cloud.hustler.pidevbackend.repository;

 import cloud.hustler.pidevbackend.entity.Quiz;
 import cloud.hustler.pidevbackend.entity.Servicee;
 import org.springframework.data.jpa.repository.JpaRepository;

 import java.util.Optional;
 import java.util.UUID;

public interface QuizRepository extends JpaRepository<Quiz, String>  {
 Optional<Quiz> findByService(Servicee service);

}
