package cloud.hustler.pidevbackend.controllers;

import cloud.hustler.pidevbackend.service.IaFarmService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Mono;

import java.io.File;
import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/ia-farm")
@RequiredArgsConstructor
public class IaFarmController {

    private final IaFarmService iaFarmService;

    //worked
    @PostMapping("/ask-farming-question")
    public Mono<ResponseEntity<String>> askFarmingQuestion(@RequestBody Map<String, String> input) {
        System.out.println("Received input: " + input);
        return iaFarmService.askFarmingQuestion(input.get("prompt"))
                .map(response -> ResponseEntity.ok().body(response))
                .defaultIfEmpty(ResponseEntity.noContent().build())
                .onErrorResume(e -> Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Error asking farming question: " + e.getMessage())));
    }


    @PostMapping("/predict-yield")
    public ResponseEntity<Object> predictYield(@RequestBody Map<String, Object> farmData) {
        try {
            Map<String, Object> prediction = iaFarmService.predictYield(farmData);
            if (prediction != null) {
                return ResponseEntity.ok().body(prediction);  // Return prediction wrapped in ResponseEntity
            } else {
                return ResponseEntity.noContent().build();  // If no content is returned, send HTTP 204
            }
        } catch (Exception e) {
            // Handle errors by returning a 500 Internal Server Error response with the error message
            Map<String, Object> errorResponse = Map.of(
                    "error", "Error predicting yield",
                    "message", e.getMessage()
            );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/analyze-crop-health")
    public Mono<ResponseEntity<String>> analyzeCropHealth(@RequestParam("file") MultipartFile file) {
        try {
            // Save uploaded file temporarily
            File tempFile = File.createTempFile("upload-", file.getOriginalFilename());
            file.transferTo(tempFile);

            return iaFarmService.predictFromImage(tempFile)
                    .map(result -> ResponseEntity.ok(result))
                    .doFinally(signal -> {
                        // Always delete temp file after finishing
                        tempFile.delete();
                    })
                    .onErrorResume(e -> Mono.just(
                            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                    .body("Error analyzing crop health: " + e.getMessage())
                    ));

        } catch (IOException e) {
            return Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to process file: " + e.getMessage()));
        }
    }



    //not working with yet

    @PostMapping("/recommend-crop")
    public Mono<ResponseEntity<String>> recommendCrop(@RequestBody Map<String, Object> input) {
        return iaFarmService.recommendCrop(input)
                .map(response -> ResponseEntity.ok().body(response))
                .defaultIfEmpty(ResponseEntity.noContent().build())
                .onErrorResume(e -> Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Error recommending crop: " + e.getMessage())));
    }



    @PostMapping("/optimize-resources")
    public Mono<ResponseEntity<String>> optimizeResources(@RequestBody Map<String, Object> resourceData) {
        return iaFarmService.getFarmResourceOptimization(resourceData)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build())
                .onErrorResume(e -> Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Error optimizing resources: " + e.getMessage())));
    }

    @GetMapping("/3d-farm-data/{farmId}")
    public Mono<ResponseEntity<String>> get3DFarmData(@PathVariable Long farmId) {
        return iaFarmService.get3DFarmData(farmId)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build())
                .onErrorResume(e -> Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Error fetching 3D farm data: " + e.getMessage())));
    }
}
