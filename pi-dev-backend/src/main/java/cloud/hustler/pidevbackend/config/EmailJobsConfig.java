package cloud.hustler.pidevbackend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@Configuration
public class EmailJobsConfig {
    public JavaMailSender getJavaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();

        // Configurer le serveur SMTP (ici pour Gmail, mais tu peux le modifier selon ton besoin)
        mailSender.setHost("smtp.gmail.com");
        mailSender.setPort(587);

        // Ton adresse email et ton mot de passe ou ton token d'application
        mailSender.setUsername("benhmida.molka01@gmail.com");
        mailSender.setPassword("rvkh txyv abuz mfmk");

        // Configuration des propriétés de la connexion SMTP
        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "587");

        return mailSender;
    }
}
