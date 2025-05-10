package tn.esprit.meddhiaalaya.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.meddhiaalaya.entity.Action;
import tn.esprit.meddhiaalaya.repository.ActionRepository;

import java.util.List;
@Service
public class ActionService implements IActionService {
    @Autowired
    private ActionRepository actionRepository;

    @Override
    public List<Action> addActions(List<Action> actions) {
        actionRepository.saveAll(actions);
        return actions;
    }


}
