package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.entity.Crop;
import cloud.hustler.pidevbackend.entity.Ressource;

import java.util.List;
import java.util.UUID;

public interface IResource {
    Ressource addRessource(Ressource resource, UUID idFarm);
    Ressource updateRessource(Ressource resource);
    void deleteRessource(UUID idResource);
    List<Ressource> getAll();
    Ressource getRessource(UUID idResource);
}
