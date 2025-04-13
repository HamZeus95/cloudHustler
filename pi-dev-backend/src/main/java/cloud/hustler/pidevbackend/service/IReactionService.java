package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.entity.Comment;
import cloud.hustler.pidevbackend.entity.Reaction;

import java.util.List;
import java.util.UUID;

public interface IReactionService {
    Reaction addReaction(Reaction reaction);
    Reaction updateReaction(Reaction reaction);
    void deleteReaction(UUID uuid_reaction);
    Reaction getReactionById(UUID uuid_reaction);
    List<Reaction> getAllReactions();
    Reaction ajouterReactionEtAffecterPost(Reaction reaction, UUID postId);


}
