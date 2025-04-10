package cloud.hustler.pidevbackend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender emailSender;

    public void sendSimpleMessage(String to, String subject, String text) {
        // Créer un message simple (texte) à envoyer
        SimpleMailMessage message = new SimpleMailMessage();
   // L'email de l'expéditeur
        message.setTo("ons26bm@gmail.com"); // L'email du destinataire
        message.setSubject(subject); // Le sujet de l'email
        message.setText(text); // Le corps de l'email

        // Envoi du message
        emailSender.send(message);
    }
}
