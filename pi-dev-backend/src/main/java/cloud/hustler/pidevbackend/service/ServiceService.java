package cloud.hustler.pidevbackend.service;



import cloud.hustler.pidevbackend.entity.Servicee;
import cloud.hustler.pidevbackend.repository.ServiceRepository;
import lombok.AllArgsConstructor;

import org.springframework.stereotype.Service;


import java.util.List;
import java.util.UUID;
@Service
@AllArgsConstructor
public class ServiceService implements IServiceService {

    private final ServiceRepository serviceRepository;

    @Override
    public List<Servicee> getAllServices() {
        return serviceRepository.findAll();
    }

    @Override
    public Servicee getServiceById(UUID id) {
        return serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found with id: " + id));
    }

    @Override
    public Servicee createService(Servicee service) {
        return serviceRepository.save(service);
    }

    @Override
    public Servicee updateService(UUID id, Servicee serviceDetails) {
        Servicee service = getServiceById(id);

        service.setTitle(serviceDetails.getTitle());
        service.setDescription(serviceDetails.getDescription());
        service.setHiring(serviceDetails.isHiring());
        service.setCategory(serviceDetails.getCategory());
        service.setSalary(serviceDetails.getSalary());
        service.setImageUrl(serviceDetails.getImageUrl());
        service.setNbWorkers(serviceDetails.getNbWorkers());
        service.setFarmer(serviceDetails.getFarmer());

        return serviceRepository.save(service);
    }

    @Override
    public void deleteService(UUID id) {
        Servicee servicee = getServiceById(id);
        serviceRepository.delete(servicee);
    }

   /* @Override
    public List<Servicee> getServicesByHiringStatus(boolean isHiring) {
        return serviceRepository.findByIsHiring(isHiring);
    }

    @Override
    public List<Servicee> getServicesByCategory(String category) {
        return serviceRepository.findByCategory(category);
    }*/




}
