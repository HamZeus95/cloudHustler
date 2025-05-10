package tn.esprit.boycott.service;

import tn.esprit.boycott.entity.Utilisateur;

import java.util.List;

public interface IUtilisateurService {
    //add
    void AddUtilisateur(Utilisateur u);
    //delete
    void DeleteUtilisateur(Utilisateur u);
    //get
    Utilisateur GetUtilisateur(long id);
    // get all
    List<Utilisateur> GetAllUtilisateur();
    //update
    void UpdateUtilisateur(Utilisateur u);

}
