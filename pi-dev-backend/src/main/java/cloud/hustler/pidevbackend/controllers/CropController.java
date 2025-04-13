package cloud.hustler.pidevbackend.controllers;

import cloud.hustler.pidevbackend.entity.Crop;
import cloud.hustler.pidevbackend.service.CropService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/crop")

public class CropController {
    @Autowired
    private CropService cropService;


    @GetMapping("/crops")
    public ResponseEntity<List<Crop>> crops() {
        List<Crop> crops = cropService.getAll();
        return ResponseEntity.ok(crops);
    }

    @GetMapping("/crop/{id}")
    public ResponseEntity<Crop> crop(@PathVariable UUID id) {
        Crop crop = cropService.getCrop(id);
        if (crop != null) {
            return ResponseEntity.ok(crop);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/add/{idFarm}")
    public ResponseEntity<Crop> addCrop(@RequestBody Crop crop,@PathVariable UUID idFarm) {
        Crop createdCrop = cropService.addCrop(crop,idFarm);
        return ResponseEntity.status(201).body(createdCrop);
    }


    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteCrop(@PathVariable UUID id) {
        cropService.deleteCrop(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/update")
    public ResponseEntity<Crop> updateCrop(@RequestBody Crop crop) {
        Crop updatedCrop = cropService.updateCrop(crop);
        if (updatedCrop != null) {
            return ResponseEntity.ok(updatedCrop);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // New endpoint to get crops by farm

}
