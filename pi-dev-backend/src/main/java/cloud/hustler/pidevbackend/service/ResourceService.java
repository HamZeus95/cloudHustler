package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.entity.Ressource;
import cloud.hustler.pidevbackend.repository.ResourceRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class ResourceService implements IResource{
    @Autowired
    private ResourceRepository resourceRepository;

    @Override
    public Ressource addRessource(Ressource ressource) {
        return resourceRepository.save(ressource);
    }

    @Override
    public Ressource updateRessource(Ressource ressource) {
        return resourceRepository.save(ressource);
    }

    @Override
    public void deleteRessource(UUID idRessource) {
        resourceRepository.deleteById(idRessource);

    }

    @Override
    public List<Ressource> getAll() {
        return resourceRepository.findAll();
    }

    @Override
    public Ressource getRessource(UUID idRessource) {
        return resourceRepository.findById(idRessource).get();
    }
}
