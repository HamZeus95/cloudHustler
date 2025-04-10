package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.entity.Comment;

import java.util.List;
import java.util.UUID;

public interface ICommentService {
    Comment addComment(Comment comment);
    Comment ajouterCommentEtAffecterPost(Comment comment,UUID postId);
    Comment updateComment(Comment comment);
    void deleteComment(UUID uuid_comment);
    List<Comment> getAllComments();
    Comment getCommentById(UUID uuid_comment);
    List<Comment> findByPostIdPost(UUID idPost);
}
