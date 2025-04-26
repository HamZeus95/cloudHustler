package cloud.hustler.pidevbackend.controllers;


import cloud.hustler.pidevbackend.entity.ServiceRequests;
import cloud.hustler.pidevbackend.entity.Servicee;
import cloud.hustler.pidevbackend.repository.QuizRepository;
import cloud.hustler.pidevbackend.repository.ServiceRepository;
import cloud.hustler.pidevbackend.repository.ServiceRequestsRepository;
import cloud.hustler.pidevbackend.service.IServiceService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/services")

@AllArgsConstructor
public class ServiceController {

    private final IServiceService serviceService;
    private final ServiceRepository serviceRepository;
    private final ServiceRequestsRepository serviceRequestsRepository;
    private final QuizRepository quizRepository;

    @GetMapping("/getService")
    public ResponseEntity<List<Servicee>> getAllServices() {
        return new ResponseEntity<>(serviceService.getAllServices(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Servicee> getServiceById(@PathVariable UUID id) {
        return new ResponseEntity<>(serviceService.getServiceById(id), HttpStatus.OK);
    }

    @PostMapping("/addService")
    public ResponseEntity<Servicee> createService(@RequestBody Servicee servicee) {
        return new ResponseEntity<>(serviceService.createService(servicee), HttpStatus.CREATED);
    }

    @PutMapping("updateService/{id}")
    public ResponseEntity<Servicee> updateService(@PathVariable UUID id, @RequestBody Servicee servicee) {
        return new ResponseEntity<>(serviceService.updateService(id, servicee), HttpStatus.OK);
    }

    @DeleteMapping("DeleteService/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable UUID id) {
        Servicee servicee = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException ("Service not found"));
        List<ServiceRequests>list=serviceRequestsRepository.findByServicee(servicee);
        // Supprimer les ServiceRequests associés (ils seront supprimés si orphanRemoval est activé)
        for (ServiceRequests serviceRequest : list) {
            serviceRequestsRepository.delete(serviceRequest);
        }

        // Supprimer le Quiz associé
        if (servicee.getQuiz() != null) {
            quizRepository.delete(servicee.getQuiz());
        }

        // Supprimer enfin le Servicee
        serviceRepository.delete(servicee);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 204 - Pas de contenu à renvoyer

    }

   /*@GetMapping("/hiring/{status}")
    public ResponseEntity<List<Servicee>> getServicesByHiringStatus(@PathVariable boolean status) {
        return new ResponseEntity<>(serviceService.getServicesByHiringStatus(status), HttpStatus.OK);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Servicee>> getServicesByCategory(@PathVariable String category) {
        return new ResponseEntity<>(serviceService.getServicesByCategory(category), HttpStatus.OK);
    }

    /*@GetMapping("/farmer/{farmerUuid}")
    public ResponseEntity<List<Servicee>> getServicesByFarmer(@PathVariable UUID farmerUuid) {
        return new ResponseEntity<>(serviceService.getServicesByFarmer(farmerUuid), HttpStatus.OK);
    }*/
}
