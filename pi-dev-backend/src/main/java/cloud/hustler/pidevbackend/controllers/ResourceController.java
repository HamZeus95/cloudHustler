package cloud.hustler.pidevbackend.controllers;


import cloud.hustler.pidevbackend.entity.Crop;
import cloud.hustler.pidevbackend.entity.Ressource;
import cloud.hustler.pidevbackend.service.CropService;
import cloud.hustler.pidevbackend.service.ResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/resource")
public class ResourceController {
    @Autowired
    private ResourceService resourceService;

    @GetMapping("/ressources")
    public List<Ressource> ressources(){
        return resourceService.getAll();
    }
    @GetMapping("/ressource/{id}")
    public Ressource ressource(@PathVariable UUID id){
        return resourceService.getRessource(id);
    }
    @PostMapping("/add")
    public Ressource addRessource(@RequestBody Ressource ressource){
        return resourceService.addRessource(ressource);
    }
    @DeleteMapping("/delete/{id}")
    public void deleteRessource(@PathVariable UUID id){
        resourceService.deleteRessource(id);
    }
    @PutMapping("/update")
    public Ressource updateRessource(@RequestBody Ressource ressource){
        return resourceService.updateRessource(ressource);
    }
}
