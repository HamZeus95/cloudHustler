package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.entity.Post;
import cloud.hustler.pidevbackend.entity.Reaction;
import cloud.hustler.pidevbackend.entity.User;
import cloud.hustler.pidevbackend.repository.PostRepository;
import cloud.hustler.pidevbackend.repository.ReactionRepository;
import cloud.hustler.pidevbackend.repository.UserRepository;
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
    @Autowired
    private UserRepository userRepository;
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
        Reaction reaction = reactionRepository.findById(uuid_reaction)
                .orElseThrow(() -> new RuntimeException("Reaction not found"));

        // Supprimer la réaction
        reactionRepository.delete(reaction);

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
    public Reaction ajouterReactionEtAffecterPost(Reaction reaction, UUID postId, UUID userUuid) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found with ID: " + postId));

        User user = userRepository.findByUuid_user(userUuid)
                .orElseThrow(() -> new RuntimeException("User not found with UUID: " + userUuid));

        reaction.setPost(post);
        reaction.setUser(user); // Associer l'utilisateur
        return reactionRepository.save(reaction);
    }
}
