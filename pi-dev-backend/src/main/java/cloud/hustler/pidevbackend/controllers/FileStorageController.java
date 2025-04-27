package cloud.hustler.pidevbackend.controllers;

import org.springframework.core.io.FileSystemResource;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
@RestController
@RequestMapping("/files")

public class FileStorageController {

    private static final String UPLOAD_DIR = "uploads";

    @PostMapping("/upload/{directory}")
    public ResponseEntity<Map<String, String>> uploadCVFile(@RequestParam("file") MultipartFile file,@PathVariable String directory) {
        try {
            System.out.println("@ upload ");
            // Crée le dossier s'il n'existe pas
            Files.createDirectories(Paths.get(UPLOAD_DIR+"/"+directory));

            // Génère un UUID et conserve l'extension du fichier
            String originalFilename = file.getOriginalFilename();
            String fileExtension = "";

            if (originalFilename != null && originalFilename.contains(".")) {
                fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            String generatedFileName = UUID.randomUUID().toString() + fileExtension;
            Path filePath = Paths.get(UPLOAD_DIR+"/"+directory).resolve(generatedFileName);

            // Sauvegarde le fichier
            Files.write(filePath, file.getBytes());

            Map<String, String> response = new HashMap<>();
            response.put("filename", directory+"/"+generatedFileName);

            return ResponseEntity.ok().body(response);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erreur lors de l'enregistrement du fichier."));
        }
    }
    @GetMapping("/download/{directory}/{fileName:.+}")
    public ResponseEntity<Resource> getFile(@PathVariable String fileName, @PathVariable String directory) {
        try {
            Path filePath = Paths.get(UPLOAD_DIR+"/"+directory).resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                // Détecte le type de contenu basé sur l'extension du fichier
                String contentType = Files.probeContentType(filePath);
                if (contentType == null) {
                    contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE; // Par défaut si type non détecté
                }

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType)) // Utilise le type MIME détecté
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    @GetMapping("/resume-extract/{directory}/{fileName:.+}")
    public ResponseEntity<?> extractResumeFromFile(@PathVariable String fileName,@PathVariable String directory) {
        try {
            // Chemin du fichier existant dans le dossier uploads
            Path filePath = Paths.get(UPLOAD_DIR,  directory,fileName).normalize();
            System.out.println(filePath.toAbsolutePath());
            if (!Files.exists(filePath)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Fichier non trouvé : " + fileName));
            }

            // Envoi au service de résumé
            ResponseEntity<Map<String, Object>> response = sendFileToResumeAPI(filePath);

            return response;

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erreur lors de l'extraction du résumé."));
        }
    }
    private ResponseEntity<Map<String, Object>> sendFileToResumeAPI(Path filePath) {
        try {
            RestTemplate restTemplate = new RestTemplate();

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", new FileSystemResource(filePath));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            String apiUrl = "http://localhost:8000/resume";

            ResponseEntity<Map> response = restTemplate.postForEntity(apiUrl, requestEntity, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> result = new HashMap<>();
                result.put("resume", response.getBody().get("resume"));
                return ResponseEntity.ok(result);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                        .body(Map.of("error", "Échec de l’appel à l’API de résumé."));
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Exception lors de l’appel à l’API de résumé."));
        }
    }



}

