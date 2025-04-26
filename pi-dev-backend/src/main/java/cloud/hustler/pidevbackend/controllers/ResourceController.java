package cloud.hustler.pidevbackend.controllers;


import cloud.hustler.pidevbackend.entity.Ressource;
import cloud.hustler.pidevbackend.entity.Ressource;
import cloud.hustler.pidevbackend.service.ResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/resource")
public class ResourceController {
    @Autowired
    private ResourceService resourceService;


    @GetMapping("/resources")
    public ResponseEntity<List<Ressource>> resources() {
        List<Ressource> resources = resourceService.getAll();
        return ResponseEntity.ok(resources);
    }

    @GetMapping("/resource/{id}")
    public ResponseEntity<Ressource> resource(@PathVariable UUID id) {
        Ressource resource = resourceService.getRessource(id);
        if (resource != null) {
            return ResponseEntity.ok(resource);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/add/{idFarm}")
    public ResponseEntity<Ressource> addRessource(@RequestBody Ressource resource,@PathVariable UUID idFarm) {
        Ressource createdRessource = resourceService.addRessource(resource,idFarm);
        return ResponseEntity.status(201).body(createdRessource);
    }


    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteRessource(@PathVariable UUID id) {
        resourceService.deleteRessource(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/update")
    public ResponseEntity<Ressource> updateRessource(@RequestBody Ressource resource) {
        Ressource updatedRessource = resourceService.updateRessource(resource);
        if (updatedRessource != null) {
            return ResponseEntity.ok(updatedRessource);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
