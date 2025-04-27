package cloud.hustler.pidevbackend.controllers;


import cloud.hustler.pidevbackend.service.IaFarmService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/ia-farm")
@RequiredArgsConstructor
public class IaFarmController {
    private final IaFarmService iaFarmService;
    @PostMapping("/recommend-crop")
    public Mono<String> recommendCrop(@RequestBody Map<String, Object> input) {
        return iaFarmService.recommendCrop(input);
    }

    @PostMapping("/ask-farming-question")
    public Mono<String> askFarmingQuestion(@RequestBody Map<String, String> input) {
        return iaFarmService.askFarmingQuestion(input.get("prompt"));

    }
}