package cloud.hustler.pidevbackend.controllers;

import cloud.hustler.pidevbackend.service.MapboxService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import org.w3c.tidy.Tidy;
import org.xhtmlrenderer.pdf.ITextRenderer;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.StringReader;
import java.io.StringWriter;
import java.util.Map;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@RestController
public class PdfController {

    @PostMapping("/generate-pdf")
    public ResponseEntity<byte[]> generatePdf(@RequestBody Map<String, String> payload) throws Exception {
        String html = payload.get("html");

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        ITextRenderer renderer = new ITextRenderer();
        renderer.setDocumentFromString(html);
        renderer.layout();
        renderer.createPDF(outputStream);

        byte[] pdfBytes = outputStream.toByteArray();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("filename", "facture.pdf");

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }
    @Autowired
    private MapboxService mapboxService;

    @GetMapping("/geocode")
    public ResponseEntity<String> geocode(@RequestParam String address) throws IOException, InterruptedException {
        String response = mapboxService.geocodeAddress(address);
        return ResponseEntity.ok(response);
    }
    @GetMapping("/updates")
    public SseEmitter streamLocation() {
        SseEmitter emitter = new SseEmitter();
        // Simule des mises à jour de position (ex: toutes les 3 secondes)
        ScheduledExecutorService executor = Executors.newScheduledThreadPool(1);
        executor.scheduleAtFixedRate(() -> {
            try {
                double lat = 48.8566 + Math.random() * 0.01;
                double lng = 2.3522 + Math.random() * 0.01;
                emitter.send("{\"lat\":" + lat + ", \"lng\":" + lng + "}");
            } catch (IOException e) {
                emitter.completeWithError(e);
            }
        }, 0, 3, TimeUnit.SECONDS);
        return emitter;
    }
}
