package cloud.hustler.pidevbackend.controllers;
//import cloud.hustler.pidevbackend.service.EmailJobsService;
import cloud.hustler.pidevbackend.service.EmailJobsService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/emails")
public class EmailJobsController {
    @Autowired
    private JavaMailSender javaMailSender;

    // Injecte l'expéditeur depuis application.properties
    private String fromEmail;
    @RequestMapping("/send")

    public void sendEmail(String to, String subject, String body) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();

        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setFrom("benhmida.molka01@gamil.com");  // <<< ICI on précise l'expéditeur
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(  body + "\n\n" +
                "📅 Veuillez choisir l’horaire qui vous convient pour l'entretien via le lien suivant :\n" +
                "👉 https://calendly.com/benhmida-molka01/30min\n\n" +
                "Merci et à très bientôt !"); // true = support HTML body

        javaMailSender.send(message);
    }
}
