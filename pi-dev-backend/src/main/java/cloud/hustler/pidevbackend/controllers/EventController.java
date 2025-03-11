package cloud.hustler.pidevbackend.controllers;

import cloud.hustler.pidevbackend.entity.Event;
import cloud.hustler.pidevbackend.service.IEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/Event")
public class EventController {
    @Autowired
    IEvent eventService;

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

}
