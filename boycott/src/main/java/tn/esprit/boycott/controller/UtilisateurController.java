package tn.esprit.boycott.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tn.esprit.boycott.entity.Utilisateur;
import tn.esprit.boycott.service.UtilisateurService;

@RestController
@RequestMapping("/user")
@CrossOrigin("*")
public class UtilisateurController {
    @Autowired
    UtilisateurService utilisateurService;

    //ajouter utilisateur
    @PostMapping("/add")
    public Utilisateur ajouterUtilisateur (Utilisateur u){
        utilisateurService.AddUtilisateur(u);
        return u;
    }


}
