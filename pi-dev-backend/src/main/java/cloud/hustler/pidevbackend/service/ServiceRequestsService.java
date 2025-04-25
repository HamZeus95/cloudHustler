package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.DTO.ServiceRequestRequestBody;
import cloud.hustler.pidevbackend.entity.ServiceRequests;
import cloud.hustler.pidevbackend.entity.Servicee;
import cloud.hustler.pidevbackend.entity.TypeStatus;
import cloud.hustler.pidevbackend.repository.ServiceRepository;
import cloud.hustler.pidevbackend.repository.ServiceRequestsRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class ServiceRequestsService implements IServiceRequestsService {

    private final ServiceRequestsRepository serviceRequestsRepository;
    private final ServiceRepository serviceRepository;

    @Override
    public List<ServiceRequests> getAllServiceRequests() {
        return serviceRequestsRepository.findAll();
    }

    @Override
    public ServiceRequests getServiceRequestById(UUID id) {
        return serviceRequestsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service Request not found with id: " + id));
    }

    @Override
    public ServiceRequests createServiceRequest(ServiceRequestRequestBody serviceRequestRequestBody) {
        Servicee service = serviceRepository.findById(serviceRequestRequestBody.getServiceId()).orElseThrow();
        ServiceRequests serviceRequest = new ServiceRequests();
        serviceRequest.setServicee(service);
        serviceRequest.setUploadCv(serviceRequestRequestBody.getUploadCv());
        serviceRequest.setLettreMotivation(serviceRequestRequestBody.getLettreMotivation());
        serviceRequest.setStatus(TypeStatus.PENDING);

        return serviceRequestsRepository.save(serviceRequest);
    }

    @Override
    public ServiceRequests updateServiceRequest(UUID id, ServiceRequests serviceRequestDetails) {
        ServiceRequests serviceRequest = getServiceRequestById(id);

        serviceRequest.setStatus(serviceRequestDetails.getStatus());
        serviceRequest.setServicee(serviceRequestDetails.getServicee());
        serviceRequest.setUsers_applying(serviceRequestDetails.getUsers_applying());
        if (serviceRequestDetails.getLettreMotivation() != null) {
            serviceRequest.setLettreMotivation(serviceRequestDetails.getLettreMotivation());
        }

        if (serviceRequestDetails.getUploadCv() != null) {
            serviceRequest.setUploadCv(serviceRequestDetails.getUploadCv());
        }
        return serviceRequestsRepository.save(serviceRequest);
    }

    @Override
    public void deleteServiceRequest(UUID id) {
        ServiceRequests serviceRequest = getServiceRequestById(id);
        serviceRequestsRepository.delete(serviceRequest);
    }

    @Override
    public ServiceRequests updateScore(UUID id, Float score) {
        System.out.println(score);
        ServiceRequests serviceRequest = getServiceRequestById(id);

        serviceRequest.setScore(score);
        return serviceRequestsRepository.save(serviceRequest);
    }

    //@Override
  //  public List<ServiceRequests> getServiceRequestsByStatus(TypeStatus status) {
       // return serviceRequestsRepository.findByStatus(status);
    //}

    /*@Override
    public List<ServiceRequests> getServiceRequestsByService(UUID serviceUuid) {
        return serviceRequestsRepository.findByServiceUuidService(serviceUuid);
    }

    @Override
    public List<ServiceRequests> getServiceRequestsByUser(UUID userUuid) {
        return serviceRequestsRepository.findByUsersApplyingUuid(userUuid);
    }

    @Override
    public ServiceRequests updateServiceRequestStatus(UUID id, TypeStatus status) {
        ServiceRequests serviceRequest = getServiceRequestById(id);
        serviceRequest.setStatus(status);
        return serviceRequestsRepository.save(serviceRequest);
    }*/
}
