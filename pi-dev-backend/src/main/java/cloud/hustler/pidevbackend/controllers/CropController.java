package cloud.hustler.pidevbackend.controllers;

import cloud.hustler.pidevbackend.entity.Crop;
import cloud.hustler.pidevbackend.service.CropService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;


@RestController
@RequestMapping("/crop")
public class CropController {
    @Autowired
    private CropService cropService;

    @GetMapping("/crops")
    public List<Crop> crops(){
        return cropService.getAll();
    }
    @GetMapping("/crop/{id}")
    public Crop crop(@PathVariable UUID id){
        return cropService.getCrop(id);
    }
    @PostMapping("/add")
    public Crop addCrop(@RequestBody Crop crop){
        return cropService.addCrop(crop);
    }
    @DeleteMapping("/delete/{id}")
    public void deleteCrop(@PathVariable UUID id){
        cropService.deleteCrop(id);
    }
    @PutMapping("/update")
    public Crop updateCrop(@RequestBody Crop crop){
        return cropService.updateCrop(crop);
    }

}
