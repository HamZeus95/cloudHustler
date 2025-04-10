package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.entity.Event;
import cloud.hustler.pidevbackend.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class EventService implements IEvent {

    @Autowired
    private EventRepository eventRepository;

    public Event createEvent(Event event) {
        event.getParticipants().add("molka");
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
}
