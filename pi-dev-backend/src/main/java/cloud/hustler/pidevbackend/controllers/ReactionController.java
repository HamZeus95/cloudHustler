package cloud.hustler.pidevbackend.controllers;

import cloud.hustler.pidevbackend.entity.Reaction;
import cloud.hustler.pidevbackend.repository.ReactionRepository;
import cloud.hustler.pidevbackend.service.IReactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping

public class ReactionController {
    @Autowired
    IReactionService reactionService;
    @PostMapping("/addReaction")
    Reaction addReaction(@RequestBody Reaction reaction) {
        return reactionService.addReaction(reaction);
    }

    @PutMapping("/updateReaction")
    Reaction updateReaction(@RequestBody Reaction reaction) {
        return reactionService.updateReaction(reaction);
    }

    @PutMapping("/deleteReaction/{uuid_reaction}")
    void deleteReaction(@PathVariable long uuid_reaction) {
        reactionService.deleteReaction(uuid_reaction);
    }

}
