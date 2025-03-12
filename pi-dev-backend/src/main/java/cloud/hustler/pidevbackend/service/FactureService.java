package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.entity.Facture;
import cloud.hustler.pidevbackend.repository.FactureRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class FactureService implements IFactureService{

    @Autowired
    private FactureRepository factureRepository;

    public Facture creerFacture(Facture facture) {
        return factureRepository.save(facture);
    }

    public List<Facture> getAllFactures() {
        return factureRepository.findAll();
    }

    public Optional<Facture> getFactureById(Long id) {
        return factureRepository.findById(id);
    }
    public Facture updateFacture(Long id, Facture facture) {
        Facture existingFacture = factureRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Facture not found"));


        return factureRepository.save(existingFacture);

    }

    public void deleteFacture(Long id) {
        if (!factureRepository.existsById(id)) {
            throw new EntityNotFoundException("Facture non trouvée");
        }
        factureRepository.deleteById(id);
    }

}
