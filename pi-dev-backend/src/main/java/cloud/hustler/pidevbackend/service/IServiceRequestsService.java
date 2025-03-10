package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.entity.ServiceRequests;
import cloud.hustler.pidevbackend.entity.TypeStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
@org.springframework.stereotype.Service
public interface IServiceRequestsService {
    List<ServiceRequests> getAllServiceRequests();
    ServiceRequests getServiceRequestById(UUID id);
    ServiceRequests createServiceRequest(ServiceRequests serviceRequest);
    ServiceRequests updateServiceRequest(UUID id, ServiceRequests serviceRequest);
    void deleteServiceRequest(UUID id);
   // List<ServiceRequests> getServiceRequestsByStatus(TypeStatus status);
    //List<ServiceRequests> getServiceRequestsByService(UUID serviceUuid);
    //List<ServiceRequests> getServiceRequestsByUser(UUID userUuid);
    //ServiceRequests updateServiceRequestStatus(UUID id, TypeStatus status);
}
