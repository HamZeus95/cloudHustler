package cloud.hustler.pidevbackend.controllers;

import cloud.hustler.pidevbackend.entity.Comment;
import cloud.hustler.pidevbackend.entity.Reaction;
import cloud.hustler.pidevbackend.repository.ReactionRepository;
import cloud.hustler.pidevbackend.service.IReactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "*")
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

    @DeleteMapping ("/deleteReaction/{uuid_reaction}")
    void deleteReaction(@PathVariable UUID uuid_reaction) {
        reactionService.deleteReaction(uuid_reaction);
    }
    @GetMapping ("/getAllReaction")
    public List<Reaction> getAllReaction() {
        return reactionService.getAllReactions();
    }

    @GetMapping("/getReactionById/{uuid_reaction}")
    Reaction getReactionById(@PathVariable UUID uuid_reaction) {
        return reactionService.getReactionById(uuid_reaction);
    }
    @PostMapping("/ajouterReactionEtAffecterPost/{postId}")
    Reaction ajouterReactionEtAffecterPost(@PathVariable UUID postId, @RequestBody Reaction reaction) {
        return reactionService.ajouterReactionEtAffecterPost(reaction, postId);
    }

}
