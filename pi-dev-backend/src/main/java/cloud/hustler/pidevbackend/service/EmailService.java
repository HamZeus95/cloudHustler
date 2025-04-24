package cloud.hustler.pidevbackend.service;
import cloud.hustler.pidevbackend.entity.Post;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender emailSender;

    public void sendPostNotification(String to, Post post) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply@isimg.tn"); // Email d'expéditeur
        message.setTo(to);
        message.setSubject("Nouveau Post Créé: " + post.getTitle());

        // Construire le contenu de l'email
        String emailContent = String.format(
                "Détails du nouveau post:\n\n" +
                        "Titre: %s\n" +
                        "Contenu: %s\n" +
                        "Date de création: %s\n" +
                        "Cordialement,\nVotre équipe",
                post.getTitle(),
                post.getContent(),
                post.getCreatedAt().toString()
        );

        message.setText(emailContent);
        emailSender.send(message);
    }
}
