package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.entity.Comment;
import cloud.hustler.pidevbackend.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service

public class CommentServiceImplement implements ICommentService {

    @Autowired
    private CommentRepository commentRepository;
    @Override
    public Comment addComment(Comment comment) {
        return commentRepository.save(comment);
    }

    @Override
    public Comment updateComment(Comment comment) {
        return commentRepository.save(comment);
    }

    @Override
    public void deleteComment(long uuid_comment) {
        commentRepository.deleteById(uuid_comment);

    }

    @Override
    public List<Comment> getAllComments() {
        return commentRepository.findAll();
    }

    @Override
    public Comment getCommentById(long uuid_comment) {
        return commentRepository.findById(uuid_comment).get();
    }
}
