package cloud.hustler.pidevbackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class PiDevBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(PiDevBackendApplication.class, args);
    }

}
