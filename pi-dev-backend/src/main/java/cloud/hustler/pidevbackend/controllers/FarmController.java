package cloud.hustler.pidevbackend.controllers;


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
    @GetMapping("/name")
    public String name(){
        String name="med dhia alaya";
        return name;
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


}
