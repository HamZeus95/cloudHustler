package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.entity.Event;
import cloud.hustler.pidevbackend.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class EventNotificationService {

    @Autowired
    private SmsService smsService;  // Ton service SMS

    @Autowired
    private EventRepository eventRepository;  // Le repository pour récupérer les événements

    // Tâche planifiée qui se déclenche tous les jours à minuit
    @Scheduled(cron = "0 0 0 * * ?")  // Tous les jours à minuit
    public void checkEventsForTomorrow() {
        // Obtenir la date de demain
        LocalDate tomorrow = LocalDate.now().plusDays(1);

        // Récupérer tous les événements dont la date de début est demain
        List<Event> events = eventRepository.findByStartDate(tomorrow);

        // Pour chaque événement, envoyer un SMS aux participants
        for (Event event : events) {
            sendSmsNotification(event);
        }
    }

    private void sendSmsNotification(Event event) {
        // Message que tu veux envoyer aux participants
        String message = "Rappel : L'événement '" + event.getName() + "' commence demain à " + event.getStartDate() + ". Ne manquez pas !";

        // Envoi du SMS à chaque participant
      /*  for (String participant : event.getParticipants()) {
            smsService.sendSms(participant, message);  // Ton service d'envoi de SMS
        }*/
    }
}
