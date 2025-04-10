package cloud.hustler.pidevbackend.controllers;

import cloud.hustler.pidevbackend.entity.Event;
import cloud.hustler.pidevbackend.service.EventNotificationService;
import cloud.hustler.pidevbackend.service.IEvent;
import cloud.hustler.pidevbackend.service.EmailService;
import cloud.hustler.pidevbackend.service.SmsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/Event")
public class EventController {

    @Autowired
    IEvent eventService;

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
    }

