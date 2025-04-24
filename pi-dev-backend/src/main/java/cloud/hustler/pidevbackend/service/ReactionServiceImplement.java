package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.entity.Post;
import cloud.hustler.pidevbackend.entity.Reaction;
import cloud.hustler.pidevbackend.repository.PostRepository;
import cloud.hustler.pidevbackend.repository.ReactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service

public class ReactionServiceImplement implements IReactionService {

    @Autowired
    private ReactionRepository reactionRepository;
    @Autowired
    private PostRepository postRepository;
    @Override
    public Reaction addReaction(Reaction reaction) {
        return reactionRepository.save(reaction);
    }

    @Override
    public Reaction updateReaction(Reaction reaction) {
        return reactionRepository.save(reaction);
    }

    @Override
    public void deleteReaction(UUID uuid_reaction) {
        reactionRepository.deleteById(uuid_reaction);

    }

    @Override
    public Reaction getReactionById(UUID uuid_reaction) {
        return reactionRepository.findById(uuid_reaction).get();
    }

    @Override
    public List<Reaction> getAllReactions() {
        return reactionRepository.findAll();
    }

    @Override
    public Reaction ajouterReactionEtAffecterPost(Reaction reaction, UUID postId) {
        Post post = postRepository.findById(postId).get();
        reaction.setPost(post);
        return reactionRepository.save(reaction);
    }
}
