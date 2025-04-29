package cloud.hustler.pidevbackend.controllers;

import cloud.hustler.pidevbackend.dto.ServiceRequestRequestBody;
import cloud.hustler.pidevbackend.entity.ServiceRequests;
import cloud.hustler.pidevbackend.entity.TypeStatus;
import cloud.hustler.pidevbackend.service.IServiceRequestsService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
 @RestController
@RequestMapping("/service-requests")
@AllArgsConstructor
public class ServiceRequestsController {
    @Autowired
    private final IServiceRequestsService serviceRequestsService;

    @GetMapping("/getAll")
    public ResponseEntity<List<ServiceRequests>> getAllServiceRequests() {
        return new ResponseEntity<>(serviceRequestsService.getAllServiceRequests(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceRequests> getServiceRequestById(@PathVariable UUID id) {
        return new ResponseEntity<>(serviceRequestsService.getServiceRequestById(id), HttpStatus.OK);
    }

    @PostMapping("/submit")
    public ResponseEntity<ServiceRequests> createServiceRequest(@RequestBody ServiceRequestRequestBody body) {

        
        return new ResponseEntity<>(serviceRequestsService.createServiceRequest(body), HttpStatus.CREATED);
    }
    @PutMapping("updateScore/{id}/{score}")
    public ResponseEntity<ServiceRequests> updateServiceRequestScore(@PathVariable UUID id,@PathVariable Float score ) {
        return new ResponseEntity<>(serviceRequestsService.updateScore(id,score),HttpStatus.OK);
    }
    @PutMapping("update/{id}")
    public ResponseEntity<ServiceRequests> updateServiceRequest(@PathVariable UUID id, @RequestBody ServiceRequests serviceRequest) {
        return new ResponseEntity<>(serviceRequestsService.updateServiceRequest(id, serviceRequest), HttpStatus.OK);
    }

    @DeleteMapping("/Delete/{id}")
    public ResponseEntity<Void> deleteServiceRequest(@PathVariable UUID id) {
        serviceRequestsService.deleteServiceRequest(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

   /* @GetMapping("/status/{status}")
    public ResponseEntity<List<ServiceRequests>> getServiceRequestsByStatus(@PathVariable TypeStatus status) {
        return new ResponseEntity<>(serviceRequestsService.getServiceRequestsByStatus(status), HttpStatus.OK);
    }

    @GetMapping("/service/{serviceUuid}")
    public ResponseEntity<List<ServiceRequests>> getServiceRequestsByService(@PathVariable UUID serviceUuid) {
        return new ResponseEntity<>(serviceRequestsService.getServiceRequestsByService(serviceUuid), HttpStatus.OK);
    }

    @GetMapping("/user/{userUuid}")
    public ResponseEntity<List<ServiceRequests>> getServiceRequestsByUser(@PathVariable UUID userUuid) {
        return new ResponseEntity<>(serviceRequestsService.getServiceRequestsByUser(userUuid), HttpStatus.OK);
    }*/

   /* @PatchMapping("/{id}/status")
    public ResponseEntity<ServiceRequests> updateServiceRequestStatus(@PathVariable UUID id, @RequestParam TypeStatus status) {
        return new ResponseEntity<>(serviceRequestsService.updateServiceRequestStatus(id, status), HttpStatus.OK);
    }*/
}
