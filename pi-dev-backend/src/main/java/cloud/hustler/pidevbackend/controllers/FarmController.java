package cloud.hustler.pidevbackend.controllers;


import cloud.hustler.pidevbackend.entity.Crop;
import cloud.hustler.pidevbackend.entity.Farm;
import cloud.hustler.pidevbackend.service.FarmService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/farm")
public class FarmController {
    @Autowired
    private FarmService farmService;

    @GetMapping("/farms")
    public List<Farm> farms(){
        return farmService.getAll();
    }

    @GetMapping("/farm/{id}")
    public Farm farm(@PathVariable UUID id){
        return farmService.getFarm(id);
    }
    @PostMapping("/add")
    public Farm addFarm(@RequestBody Farm farm){
        return farmService.addFarm(farm);
    }
    @DeleteMapping("/delete/{id}")
    public void deleteFarm(@PathVariable UUID id){
        farmService.deleteFarm(id);
    }
    @PutMapping("/update")
    public Farm updateFarm(@RequestBody Farm farm){
        return farmService.updateFarm(farm);
    }

    @GetMapping("/cropsByFarm/{idFarm}")
    public List<Crop> getCropsByFarm(@PathVariable UUID idFarm){
        return farmService.getCropsByFarm(idFarm);
    }


}
