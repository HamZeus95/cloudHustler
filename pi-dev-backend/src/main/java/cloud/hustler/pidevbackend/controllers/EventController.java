package cloud.hustler.pidevbackend.controllers;

import cloud.hustler.pidevbackend.entity.Event;
import cloud.hustler.pidevbackend.repository.EventRepository;
import cloud.hustler.pidevbackend.service.EventNotificationService;
import cloud.hustler.pidevbackend.service.IEvent;
import cloud.hustler.pidevbackend.service.EmailService;
import cloud.hustler.pidevbackend.service.SmsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/Event")
public class EventController {

    @Autowired
    IEvent eventService;
    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private EmailService emailService;
    // Injection du service d'email
    @Autowired
    private SmsService smsService;
    @Autowired
    private EventNotificationService eventNotificationService;
    @PostMapping("/addEvent")
    public Event createEvent(@RequestBody Event event) {
        return eventService.createEvent(event);
    }

    @GetMapping("/getEvents")
    public List<Event> getAllEvents() {
        return eventService.getAllEvents();
    }

    @PutMapping("/updateEvent")
    public Event updateEvent(@RequestBody Event event) {
        return eventService.updateEvent(event);
    }
    @GetMapping("/events/{id}")
    public Event getEventById(@PathVariable UUID id) {
        return eventService.getEventById(id);
    }
    @DeleteMapping("/deleteEvent/{id}")
    public void deleteEvent(@PathVariable UUID id) {
        eventService.deleteEvent(id);
    }

    // Méthode pour notifier un participant par email
    @PostMapping("/sendTestEmail")
    public String sendTestEmail() {
        // Envoie un email de test
        emailService.sendSimpleMessage("ons26bm@gmail.com", "Test Email", "Ceci est un test de Spring Boot.");
        return "Email envoyé avec succès!";
    }
    @PostMapping("/send")
    public String sendSms(@RequestParam String to, @RequestParam String message) {
        smsService.sendSms(to, message);
        return "Message envoyé avec succès";
    }
    @PostMapping("/checkEventsForTomorrow")
    public String checkAndNotifyEventsForTomorrow() {
        eventNotificationService.checkEventsForTomorrow();  // Appeler le service de notification
        return "Vérification des événements pour demain effectuée.";
    }
    @PutMapping("/{eventId}/add-participant")
    public ResponseEntity<?> addParticipant(@PathVariable String eventId, @RequestBody String participantName) {
        Optional<Event> optionalEvent = eventRepository.findById(UUID.fromString(eventId));

        if (optionalEvent.isPresent()) {
            Event event = optionalEvent.get();

            if (!event.getParticipants().contains(participantName)) {
                event.getParticipants().add(participantName);
                eventRepository.save(event);
                return ResponseEntity.ok(event);
            } else {
                return ResponseEntity.badRequest().body("Participant already exists");
            }
        }
        return ResponseEntity.notFound().build();
    }
    private static final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads/";

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            // Créer le dossier si nécessaire
            File directory = new File(UPLOAD_DIR);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            // Générer un nom de fichier unique
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(UPLOAD_DIR + fileName);

            // Log du fichier enregistré
            System.out.println("Enregistrement du fichier à : " + filePath.toString());

            Files.write(filePath, file.getBytes());

            // Retourner l'URL accessible
            String fileUrl = "http://localhost:8089/uploads/" + fileName;

            Map<String, String> response = new HashMap<>();
            response.put("imageUrl", fileUrl);
            return ResponseEntity.ok(response);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "Erreur lors de l'upload"));
        }
    }

}


