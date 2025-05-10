package tn.esprit.meddhiaalaya.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.meddhiaalaya.entity.Portefeuille;
import tn.esprit.meddhiaalaya.repository.ActionRepository;
import tn.esprit.meddhiaalaya.repository.PortefeuilleRepository;

@Service
public class PortefeuilleService implements IPortefeuilleService {
    @Autowired
    private PortefeuilleRepository portefeuilleRepository;


    @Override
    public Portefeuille addPortefeuilleWithElements(Portefeuille portefeuille) {
        return portefeuilleRepository.save(portefeuille);
    }
}
