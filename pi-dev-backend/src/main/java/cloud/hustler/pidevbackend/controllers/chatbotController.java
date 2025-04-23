package cloud.hustler.pidevbackend.controllers;

import cloud.hustler.pidevbackend.service.ChatbotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/chatbot")
public class chatbotController {
    @Autowired
    private ChatbotService chatbotService;

    @PostMapping("/message")
    public ResponseEntity<String> processMessage(@RequestBody String message) {
        String response = chatbotService.processMessage(message);
        return ResponseEntity.ok(response);
    }

}
