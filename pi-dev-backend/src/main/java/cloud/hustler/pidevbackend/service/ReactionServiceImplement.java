package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.entity.Reaction;
import cloud.hustler.pidevbackend.repository.ReactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service

public class ReactionServiceImplement implements IReactionService {

    @Autowired
    private ReactionRepository reactionRepository;
    @Override
    public Reaction addReaction(Reaction reaction) {
        return reactionRepository.save(reaction);
    }

    @Override
    public Reaction updateReaction(Reaction reaction) {
        return reactionRepository.save(reaction);
    }

    @Override
    public void deleteReaction(long uuid_reaction) {
        reactionRepository.deleteById(uuid_reaction);

    }

    @Override
    public Reaction getReactionById(long uuid_reaction) {
        return reactionRepository.findById(uuid_reaction).get();
    }

    @Override
    public List<Reaction> getAllReactions() {
        return reactionRepository.findAll();
    }
}
