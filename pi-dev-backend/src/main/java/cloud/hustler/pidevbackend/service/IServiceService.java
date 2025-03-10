package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.entity.Servicee;

import java.util.List;
import java.util.UUID;

public interface IServiceService {
    List<Servicee> getAllServices();
    Servicee getServiceById(UUID id);
    Servicee createService(Servicee servicee);
    Servicee updateService(UUID id, Servicee servicee);
    void deleteService(UUID id);
    List<Servicee> getServicesByHiringStatus(boolean isHiring);
    List<Servicee> getServicesByCategory(String category);
    //List<Servicee> getServicesByFarmer(UUID farmerUuid);
}
