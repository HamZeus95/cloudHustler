package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.entity.Facture;

import java.util.List;
import java.util.Optional;

public interface IFactureService {
    Facture creerFacture(Facture facture);
    List<Facture> getAllFactures();
    Optional<Facture> getFactureById(Long id);
    public Facture updateFacture(Long id, Facture facture);
    public void deleteFacture(Long id);
    }