package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.entity.Ressource;

import java.util.List;

public interface IResource {
    Ressource addRessource(Ressource ressource);
    Ressource updateRessource(Ressource ressource);
    void deleteRessource(long idRessource);
    List<Ressource> getAll();
    Ressource getRessource(long idRessource);
}
