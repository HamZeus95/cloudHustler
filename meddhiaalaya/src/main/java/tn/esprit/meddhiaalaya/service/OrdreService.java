package tn.esprit.meddhiaalaya.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import tn.esprit.meddhiaalaya.entity.Ordre;
import tn.esprit.meddhiaalaya.entity.Status;
import tn.esprit.meddhiaalaya.entity.Type;
import tn.esprit.meddhiaalaya.repository.OrdreRepository;

import java.time.LocalDate;

@Service
public class OrdreService implements IOrdreService {
    @Autowired
    OrdreRepository ordreRepository;

    @Override
    public Ordre addOrdreAndAffectToActionAndPortefeuille(Ordre ordre, String symbole, int reference) {
        ordre.setStatus(Status.EN_ATTENTE);
        ordre.setDateCreation(LocalDate.now());
        if(ordre.getAction().equals(Type.ACHAT)) {

        }
        if(ordre.getAction().equals(Type.VENTE)){

        }
        return ordreRepository.save(ordre);

    }

    @Scheduled(cron = "0 0/2 * * * *")
    void checkOrdre() {

    }
}
