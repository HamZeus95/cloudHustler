package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.entity.Reaction;

import java.util.List;

public interface IReactionService {
    Reaction addReaction(Reaction reaction);
    Reaction updateReaction(Reaction reaction);
    void deleteReaction(long uuid_reaction);
    Reaction getReactionById(long uuid_reaction);
    List<Reaction> getAllReactions();
}
