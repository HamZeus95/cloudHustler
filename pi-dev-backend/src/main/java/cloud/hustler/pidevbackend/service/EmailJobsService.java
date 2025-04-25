package cloud.hustler.pidevbackend.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;


import javax.mail.MessagingException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
@Service
public class EmailJobsService {
    @Autowired
    private JavaMailSender emailSender;  // Injection correcte

    public void sendSimpleMessage(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("benhmida.molka01@gmail.com");
        message.setTo(to);
        message.setSubject(subject);
        message.setText(
                body + "\n\n" +
                        "📅 Veuillez choisir l’horaire qui vous convient pour l'entretien via le lien suivant :\n" +
                        "👉 https://calendly.com/benhmida-molka01/30min\n\n" +
                        "Merci et à très bientôt !"
        );


        emailSender.send(message);  // Utilisation de JavaMailSender
    }
    }

