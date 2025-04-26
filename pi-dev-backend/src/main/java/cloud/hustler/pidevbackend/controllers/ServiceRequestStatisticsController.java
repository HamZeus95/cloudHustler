package cloud.hustler.pidevbackend.controllers;

import cloud.hustler.pidevbackend.entity.TypeJobStatus;
import cloud.hustler.pidevbackend.repository.ServiceRequestsRepository;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
@CrossOrigin(origins = "*")

@RestController
@RequestMapping("/service-requests/statistics")
public class ServiceRequestStatisticsController {

    private final ServiceRequestsRepository serviceRequestRepository;

    public ServiceRequestStatisticsController(ServiceRequestsRepository serviceRequestRepository) {
        this.serviceRequestRepository = serviceRequestRepository;
    }

    @GetMapping("/status-counts")
    public Map<String, Integer> getStatusCounts() {
        Map<String, Integer> stats = new HashMap<>();
        stats.put("accepted", serviceRequestRepository.countByStatus(TypeJobStatus.ACCEPTED));
        stats.put("rejected", serviceRequestRepository.countByStatus(TypeJobStatus.REJECTED));
        stats.put("pending", serviceRequestRepository.countByStatus(TypeJobStatus.PENDING));
        return stats;
    }
}
