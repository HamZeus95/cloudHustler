package cloud.hustler.pidevbackend.controllers;
//import cloud.hustler.pidevbackend.service.EmailJobsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")

@RestController
@RequestMapping("/emails")
public class EmailJobsController {
//    @Autowired
//    private EmailJobsService emailService;

    @PostMapping("/send")
    public ResponseEntity<?> sendEmail(@RequestParam String subject, @RequestParam String body,@RequestParam String to) {
        // Définir les destinataires statiques ici
        // Appeler la méthode d'envoi d'e-mail du service avec les destinataires statiques
        // emailService.sendSimpleMessage(to, subject, body);

        // Retourner une réponse indiquant que l'e-mail a été envoyé avec succès
        return ResponseEntity.ok("Email sent successfully to static recipients");
    }

}
