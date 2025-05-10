package tn.esprit.meddhiaalaya.service;


import tn.esprit.meddhiaalaya.entity.Ordre;

public interface IOrdreService {
    Ordre addOrdreAndAffectToActionAndPortefeuille(Ordre ordre, String symbole,int reference);
}
