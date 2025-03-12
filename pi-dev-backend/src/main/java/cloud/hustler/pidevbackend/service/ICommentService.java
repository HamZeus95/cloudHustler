package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.entity.Comment;

import java.util.List;

public interface ICommentService {
    Comment addComment(Comment comment);
    Comment updateComment(Comment comment);
    void deleteComment(long uuid_comment);
    List<Comment> getAllComments();
    Comment getCommentById(long uuid_comment);
}
