package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.entity.Event;
import org.apache.tomcat.util.net.openssl.ciphers.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface IEvent {
    Event createEvent(Event event);
    List<Event> getAllEvents();
    // Optional<Event> getEventById(UUID id);
    Event updateEvent(Event event);
    void deleteEvent(UUID id);
    Event getEventById(UUID id);
    String uploadImage(String eventId, MultipartFile file) throws IOException;
    Event participate(UUID eventId, UUID userId);
}
