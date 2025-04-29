package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.entity.Comment;
import cloud.hustler.pidevbackend.entity.Post;
import cloud.hustler.pidevbackend.entity.User;
import cloud.hustler.pidevbackend.repository.CommentRepository;
import cloud.hustler.pidevbackend.repository.PostRepository;
import cloud.hustler.pidevbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.List;
import java.util.UUID;

@Service

public class CommentServiceImplement implements ICommentService {

    @Autowired
    private CommentRepository commentRepository;
    @Autowired
    private PostRepository postRepository;
    @Autowired
    private UserRepository userRepository;
    @Override
    public Comment addComment(Comment comment) {
        return commentRepository.save(comment);
    }

    @Override
    public Comment ajouterCommentEtAffecterPost(Comment comment, UUID postId, UUID userUuid) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found with ID: " + postId));

        User user = userRepository.findByUuid_user(userUuid)
                .orElseThrow(() -> new RuntimeException("User not found with UUID: " + userUuid));

        comment.setPost(post);
        comment.setUser(user); // Associer aussi l'utilisateur au commentaire
        return commentRepository.save(comment);
    }

    @Override
    public Comment updateComment(Comment comment) {
        return commentRepository.save(comment);
    }

    @Override
    public void deleteComment(UUID uuid_comment) {
        commentRepository.deleteById(uuid_comment);

    }

    @Override
    public List<Comment> getAllComments() {
        return commentRepository.findAll();
    }

    @Override
    public Comment getCommentById(UUID uuid_comment) {
        System.out.println("dff"+uuid_comment);
        return commentRepository.findById(uuid_comment).get();
    }

    @Override
    public List<Comment> findByPostIdPost(UUID idPost) {
        return commentRepository.findByPostIdPost(idPost);
    }

    @Override
    public void deleteAllByPostId(UUID postId) {

    }

    @Override
    public Comment updateCommentById(UUID uuid_comment,Comment commentUpdate) {
        Comment existingcomment = commentRepository.findById(uuid_comment).orElseThrow();
        if (commentUpdate.getContent() != null) existingcomment.setContent(commentUpdate.getContent());
        existingcomment.setUpdatedAt(new Date(System.currentTimeMillis()));
    return commentRepository.save(existingcomment);
    }



}
