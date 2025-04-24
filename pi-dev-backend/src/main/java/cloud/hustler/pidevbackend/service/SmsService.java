package cloud.hustler.pidevbackend.service;
<<<<<<< HEAD

=======
>>>>>>> origin/Resource
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
<<<<<<< HEAD
=======
import javax.annotation.PostConstruct;
>>>>>>> origin/Resource

@Service
public class SmsService {

<<<<<<< HEAD
    @Value("${twilio.accountSid}")
    private String accountSid;

    @Value("${twilio.authToken}")
    private String authToken;

    @Value("${twilio.phoneNumber}")
    private String twilioPhoneNumber;

    public void sendSms(String to, String body) {
        // Initialiser Twilio avec les identifiants
        Twilio.init(accountSid, authToken);

        // Envoyer le message
        Message message = Message.creator(
                new PhoneNumber("+21692701943"),    // Numéro du destinataire
                new PhoneNumber("+19032895307"),  // Numéro Twilio
                body                     // Corps du message
        ).create();

        System.out.println("SMS envoyé avec SID : " + message.getSid());
    }
}
=======

    @Value("${twilio.account.sid}")
private String accountSid;

    @Value("${twilio.auth.token}")
    private String authToken;

    @Value("${twilio.messaging.service.sid}")
    private String messagingServiceSid;

    @PostConstruct
    public void init() {
        Twilio.init(accountSid, authToken);
    }

    public void sendSms(String toPhoneNumber, String messageBody) {
        try {
            Message message = Message.creator(
                            new PhoneNumber(toPhoneNumber),
                            messagingServiceSid,  // Utilisation du Messaging Service
                            messageBody)
                    .create();

            System.out.println("SMS envoyé avec SID: " + message.getSid());
        } catch (Exception e) {
            System.err.println("Erreur d'envoi SMS: " + e.getMessage());
            throw new RuntimeException("Échec d'envoi SMS", e);
        }
    }
}
>>>>>>> origin/Resource
