package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.entity.Ressource;
import cloud.hustler.pidevbackend.repository.ResourceRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ResourceService implements IResource{
    @Autowired
    private ResourceRepository resourceRepository;

    @Override
    public Ressource addRessource(Ressource ressource) {
        return null;
    }

    @Override
    public Ressource updateRessource(Ressource ressource) {
        return null;
    }

    @Override
    public void deleteRessource(long idRessource) {

    }

    @Override
    public List<Ressource> getAll() {
        return List.of();
    }

    @Override
    public Ressource getRessource(long idRessource) {
        return null;
    }
}
