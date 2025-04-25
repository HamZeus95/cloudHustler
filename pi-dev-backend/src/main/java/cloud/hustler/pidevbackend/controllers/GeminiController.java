package cloud.hustler.pidevbackend.controllers;


import cloud.hustler.pidevbackend.service.GeminiService;
import cloud.hustler.pidevbackend.service.ICommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Collections;
import java.util.Map;

@RestController


@CrossOrigin(origins = "*") // Autorise explicitement Angular

@RequestMapping("/gemini")
public class GeminiController {
    // ...


    private final GeminiService geminiService;

    public GeminiController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping("/chat")
    public Mono<ResponseEntity<Map<String, String>>> chat(@RequestBody Map<String, String> request) {
        return geminiService.generateText(request.get("prompt"))
                .map(response -> ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(Collections.singletonMap("response", response)))
                .onErrorResume(e -> Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Collections.singletonMap("error", "Error processing request"))));
    }
}
