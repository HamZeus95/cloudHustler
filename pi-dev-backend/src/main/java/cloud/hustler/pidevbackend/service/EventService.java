package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.entity.Event;
import cloud.hustler.pidevbackend.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

    public Event createEvent(Event event) {
        event.getParticipants().add("ons");
        if (event.getStartDate().equals(LocalDate.now().plusDays(1))) {
            // Envoyer le SMS à chaque participant
            String message = "Rappel : L'événement '" + event.getName() + "' commence demain à " + event.getStartDate() + ". Ne manquez pas !";

            for (String participant : event.getParticipants()) {
                smsService.sendSms(participant, message);
            }
        }
        return eventRepository.save(event);
    }

    @Override
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    @Override
    public Event updateEvent(Event event) {
        event.getParticipants().add("molka"); // Remplace "NomStatique" par le nom que tu veux ajouter
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





}
