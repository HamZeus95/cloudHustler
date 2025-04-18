package cloud.hustler.pidevbackend.service;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import javax.annotation.PostConstruct;

@Service
public class SmsService {


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