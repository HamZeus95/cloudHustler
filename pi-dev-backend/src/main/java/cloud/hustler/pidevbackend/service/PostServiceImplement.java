package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.entity.Comment;
import cloud.hustler.pidevbackend.entity.Post;
import cloud.hustler.pidevbackend.entity.Reaction;
import cloud.hustler.pidevbackend.repository.CommentRepository;
import cloud.hustler.pidevbackend.repository.PostRepository;
import cloud.hustler.pidevbackend.repository.ReactionRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service

public class PostServiceImplement implements IPostService {

    @Autowired
    private PostRepository postRepository;
    @Autowired
    private CommentRepository commentRepository;
    @Autowired
    private ReactionRepository reactionRepository;

    @Override
    public Post addPost(Post post) {
        return postRepository.save(post);
    }

    @Override
    public Post updatePost(Post post) {
        return postRepository.save(post);
    }




    @Override
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    @Override
    public Post getPostById(UUID postId) {
        return postRepository.findById(postId).get();
    }

    @Override
    public Post updatePostById(UUID postId, Post postUpdates) {
        Post existingPost = postRepository.findById(postId).orElseThrow();

        if (postUpdates.getTitle() != null) existingPost.setTitle(postUpdates.getTitle());
        if (postUpdates.getContent() != null) existingPost.setContent(postUpdates.getContent());

        existingPost.setUpdatedAt(new Date(System.currentTimeMillis())); // ← Constructeur avec timestamp

        return postRepository.save(existingPost);
    }


    @Override
    @Transactional
    public void deletePostByIdWithCommentAndReaction(UUID postId) {
        // 1. Supprimer les réactions des commentaires du post
        reactionRepository.deleteAllReactionByPostId(postId);

        // 2. Supprimer les commentaires du post
        commentRepository.deleteAllByPostId(postId);

      

        // 4. Supprimer le post lui-même
        postRepository.deleteById(postId);
    }


}
