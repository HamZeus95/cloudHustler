package cloud.hustler.pidevbackend.controllers;


import cloud.hustler.pidevbackend.entity.Servicee;
import cloud.hustler.pidevbackend.service.IServiceService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/services")

@AllArgsConstructor
public class ServiceController {

    private final IServiceService serviceService;

    @GetMapping
    public ResponseEntity<List<Servicee>> getAllServices() {
        return new ResponseEntity<>(serviceService.getAllServices(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Servicee> getServiceById(@PathVariable UUID id) {
        return new ResponseEntity<>(serviceService.getServiceById(id), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Servicee> createService(@RequestBody Servicee servicee) {
        return new ResponseEntity<>(serviceService.createService(servicee), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Servicee> updateService(@PathVariable UUID id, @RequestBody Servicee servicee) {
        return new ResponseEntity<>(serviceService.updateService(id, servicee), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable UUID id) {
        serviceService.deleteService(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/hiring/{status}")
    public ResponseEntity<List<Servicee>> getServicesByHiringStatus(@PathVariable boolean status) {
        return new ResponseEntity<>(serviceService.getServicesByHiringStatus(status), HttpStatus.OK);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Servicee>> getServicesByCategory(@PathVariable String category) {
        return new ResponseEntity<>(serviceService.getServicesByCategory(category), HttpStatus.OK);
    }

    //@GetMapping("/farmer/{farmerUuid}")
   // public ResponseEntity<List<Servicee>> getServicesByFarmer(@PathVariable UUID farmerUuid) {
     //   return new ResponseEntity<>(serviceService.getServicesByFarmer(farmerUuid), HttpStatus.OK);
    //}
}
