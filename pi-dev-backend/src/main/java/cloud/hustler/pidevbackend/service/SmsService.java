package cloud.hustler.pidevbackend.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class SmsService {

    @Value("ACb3b7541e32a43482b750e32b515aa76d")
    private String accountSid;

    @Value("64e2a042f62d4eb55c761cd0d2247b5c")
    private String authToken;

    @Value("+19182628540")
    private String twilioPhoneNumber;

    public void sendSms(String to, String body) {
        // Initialiser Twilio avec les identifiants
        Twilio.init(accountSid, authToken);

        // Envoyer le message
        Message message = Message.creator(
                new PhoneNumber("+21692701943"),    // Numéro du destinataire
                new PhoneNumber("+19182628540"),  // Numéro Twilio
                body                     // Corps du message
        ).create();

        System.out.println("SMS envoyé avec SID : " + message.getSid());
    }
}