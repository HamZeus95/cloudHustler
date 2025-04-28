package cloud.hustler.pidevbackend.controllers;

import cloud.hustler.pidevbackend.entity.Event;
import cloud.hustler.pidevbackend.repository.EventRepository;
import cloud.hustler.pidevbackend.service.*;
import org.apache.tomcat.util.net.openssl.ciphers.Authentication;
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
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/Event")
public class EventController {

    @Autowired
    IEvent eventService;
@Autowired
CloudinaryService cloudinaryService;
    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private SmsService smsService;
    @Autowired
    private HuggingFaceService huggingFaceService;


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



    @PostMapping("/send")
    public String sendSms(@RequestParam String to, @RequestParam String message) {
        smsService.sendSms(to, message);
        return "Message envoyé avec succès";
    }

    @PostMapping("/checkEventsForTomorrow")
    public String checkAndNotifyEventsForTomorrow() {
        eventNotificationService.checkEventsForTomorrow();
        return "Vérification des événements pour demain effectuée.";
    }

    @PutMapping("/events/{eventId}/{consumerId}/participate")
    public ResponseEntity<Event> participate(
            @PathVariable UUID eventId,
            @PathVariable UUID consumerId) {

        System.out.println("=== STARTING PARTICIPATION REQUEST ===");
        System.out.printf("Raw Path Variables - EventId: %s (%s), ConsumerId: %s (%s)%n",
                eventId, eventId.getClass().getSimpleName(),
                consumerId, consumerId.getClass().getSimpleName());

        try {
            System.out.println("Attempting participation for:");
            System.out.printf("- Event ID: %s%n", eventId.toString());
            System.out.printf("- Consumer ID: %s%n", consumerId.toString());
            System.out.printf("- Current Time: %s%n", LocalDateTime.now());

            // 1. Appeler la participation et récupérer l'Event mis à jour
            Event updatedEvent = eventService.participate(eventId, consumerId);

            System.out.println("=== PARTICIPATION SUCCESSFUL ===");
            return ResponseEntity.ok(updatedEvent); // <<< CHANGEMENT IMPORTANT

        } catch (RuntimeException e) {
            System.err.println("=== BUSINESS ERROR ===");
            System.err.printf("Error during participation: %s%n", e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build(); // <<< Pas besoin de body texte

        } catch (Exception e) {
            System.err.println("=== TECHNICAL ERROR ===");
            System.err.printf("Unexpected error: %s%n", e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // <<< Pareil
        } finally {
            System.out.println("=== REQUEST PROCESSING COMPLETE ===");
        }
    }



    @PostMapping("/generate-description")
    public ResponseEntity<String> generateEventDescription(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        String location = request.get("location");
        String date = request.get("date");

        if (name == null || location == null || date == null) {
            return ResponseEntity.badRequest().body("Paramètres manquants");
        }

        String description = huggingFaceService.generateDescription(name, location, date);

        if (description.length() > 255) {
            description = description.substring(0, 255);
        }

        return ResponseEntity.ok(description);
    }

    @PostMapping("/{eventId}/upload-image")
    public ResponseEntity<?> uploadEventImage(@PathVariable("eventId") UUID eventId,
                                              @RequestParam("file") MultipartFile file) {
        try {
            Optional<Event> eventOptional = eventRepository.findById(eventId);
            if (eventOptional.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            String imageUrl = cloudinaryService.uploadImage(file);
            Event event = eventOptional.get();
            event.setImageUrl(imageUrl); // You need an imageUrl field in your Event entity
            eventRepository.save(event);

            return ResponseEntity.ok(event);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Image upload failed: " + e.getMessage());
        }
    }
}
