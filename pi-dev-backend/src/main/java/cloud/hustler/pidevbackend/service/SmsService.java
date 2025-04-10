package cloud.hustler.pidevbackend.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class SmsService {

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
