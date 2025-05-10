package tn.esprit.boycott.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.boycott.entity.Utilisateur;
import tn.esprit.boycott.repository.UtilisateurRepository;

import java.util.List;

@Service
public class UtilisateurService implements IUtilisateurService {
    @Autowired
    private UtilisateurRepository utilisateurRepository;


    @Override
    public void AddUtilisateur(Utilisateur u) {
        utilisateurRepository.save(u);

    }

    @Override
    public void DeleteUtilisateur(Utilisateur u) {
        utilisateurRepository.delete(u);

    }

    @Override
    public Utilisateur GetUtilisateur(long id) {
        return utilisateurRepository.findById(id).get();
    }

    @Override
    public List<Utilisateur> GetAllUtilisateur() {
        return utilisateurRepository.findAll();
    }

    @Override
    public void UpdateUtilisateur(Utilisateur u) {
        utilisateurRepository.save(u);

    }
}
