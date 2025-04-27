package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.entity.Consumer;
import cloud.hustler.pidevbackend.entity.Event;
import cloud.hustler.pidevbackend.entity.User;
import cloud.hustler.pidevbackend.repository.ConsumerRepository;
import cloud.hustler.pidevbackend.repository.EventRepository;
import cloud.hustler.pidevbackend.repository.UserRepository;
import org.apache.tomcat.util.net.openssl.ciphers.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;

@Service
public class EventService implements IEvent {

    @Autowired
    private EventRepository eventRepository;
    @Autowired
    private SmsService smsService;
    @Autowired
    private ConsumerRepository consumerRepository;


    public Event createEvent(Event event) {

        return eventRepository.save(event);
    }

    @Override
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    @Override
    public Event updateEvent(Event event) {
        //event.getParticipants().add("molka"); // Remplace "NomStatique" par le nom que tu veux ajouter
        return eventRepository.save(event);
    }

    @Override
    public void deleteEvent(UUID id) {
        eventRepository.deleteById(id);
    }

    // Nouvelle méthode pour récupérer un événement par son ID
    public Event getEventById(UUID id) {
        Optional<Event> event = eventRepository.findById(id);
        return event.orElse(null); // Retourne null si l'événement n'est pas trouvé
    }
    @Override
    public String uploadImage(String eventId, MultipartFile file) throws IOException {
        Event event = eventRepository.findById(UUID.fromString(eventId))
                .orElseThrow(() -> new IllegalArgumentException("Événement introuvable"));

        if (new Date().before(Date.from(event.getStartDate().atStartOfDay(ZoneId.systemDefault()).toInstant()))) {
            throw new IllegalStateException("L'événement n'a pas encore commencé");
        }

        String uploadDir = "uploads/events/" + eventId;
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        Path filePath = uploadPath.resolve(file.getOriginalFilename());
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Optionnel : eventRepository.save(event);

        // Retourner juste le nom de l'image
        return file.getOriginalFilename();
    }

    public void participate(UUID eventId, UUID consumerId) {
        Consumer consumer = consumerRepository.findById(consumerId)
                .orElseThrow(() -> new RuntimeException("Utilisateur avec l'ID " + consumerId + " non trouvé"));

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Événement avec l'ID " + eventId + " non trouvé"));

        if (event.getParticipants().contains(consumer)) {
            throw new RuntimeException("Utilisateur déjà inscrit à l'événement");
        }

        event.getParticipants().add(consumer);
        event.setNbrParticipants(event.getNbrParticipants()+1);
        eventRepository.save(event);

        System.out.println("Utilisateur " + consumer.getFirstName() + " ajouté à l'événement " + event.getName());

        if (event.getStartDate().equals(LocalDate.now().plusDays(1))) {
            try {
                String message = String.format(
                        "Bonjour %s, rappel : l'événement '%s' commence demain (%s).",
                        consumer.getFirstName(), event.getName(), event.getStartDate());
                smsService.sendSms(consumer.getPhone(), message);
                System.out.println("SMS sent successfully");
            } catch (Exception e) {
                System.err.println("Failed to send SMS: " + e.getMessage());
                // Continue without failing the entire participation
                // Or throw if SMS is critical: throw new RuntimeException("SMS sending failed", e);
            }
        }

    }










}
