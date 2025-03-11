package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.entity.Event;

import java.util.List;
import java.util.UUID;

public interface IEvent {
    Event createEvent(Event event);
    List<Event> getAllEvents();
    // Optional<Event> getEventById(UUID id);
    Event updateEvent(Event event);
    void deleteEvent(UUID id);
}
