package tn.esprit.meddhiaalaya.controller;


import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.esprit.meddhiaalaya.entity.Action;
import tn.esprit.meddhiaalaya.entity.Ordre;
import tn.esprit.meddhiaalaya.entity.Portefeuille;
import tn.esprit.meddhiaalaya.service.IActionService;
import tn.esprit.meddhiaalaya.service.IOrdreService;
import tn.esprit.meddhiaalaya.service.IPortefeuilleService;
import tn.esprit.meddhiaalaya.service.PortefeuilleService;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/test")
@CrossOrigin("*")
public class controller {
    @Autowired
    private final IActionService actionService;
    @Autowired
    private final IPortefeuilleService portefeuilleService;
    @Autowired
    private final IOrdreService ordreService;



    @GetMapping("get")
    public String get() {
        return "Hello World";
    }

    @PostMapping("/addActions")
    public List<Action> addActions(@RequestBody List<Action> actions) {
        return actionService.addActions(actions);
    }

    @PostMapping("/addPortefeuille")
    public Portefeuille addPortefeuille(@RequestBody Portefeuille portefeuille) {
        return portefeuilleService.addPortefeuilleWithElements(portefeuille);
    }
    @PostMapping("/addOrdre")
    public Ordre addOrdreAndAffectToActionAndPortefeuille(@RequestBody Ordre ordre,@RequestBody String symbole,@RequestBody int reference){
        return ordreService.addOrdreAndAffectToActionAndPortefeuille(ordre,symbole,reference);
    }


}
