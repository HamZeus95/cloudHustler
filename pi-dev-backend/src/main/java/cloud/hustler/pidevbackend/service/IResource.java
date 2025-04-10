package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.entity.Ressource;

import java.util.List;
import java.util.UUID;

public interface IResource {
    Ressource addRessource(Ressource ressource);
    Ressource updateRessource(Ressource ressource);
    void deleteRessource(UUID idRessource);
    List<Ressource> getAll();
    Ressource getRessource(UUID idRessource);
}
