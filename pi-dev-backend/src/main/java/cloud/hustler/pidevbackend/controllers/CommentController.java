package cloud.hustler.pidevbackend.controllers;

import cloud.hustler.pidevbackend.entity.Comment;
import cloud.hustler.pidevbackend.entity.Post;
import cloud.hustler.pidevbackend.service.CommentServiceImplement;
import cloud.hustler.pidevbackend.service.ICommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;


@RestController
@RequestMapping("/comments")
public class CommentController {

    @Autowired
    CommentServiceImplement commentService;
    @PostMapping("/addComment")
    Comment addComment(@RequestBody Comment comment) {
        return commentService.addComment(comment);
    }




    @PutMapping("/updateCommentById/{commentId}")
    public ResponseEntity<Comment> updateCommentById(@PathVariable UUID commentId, @RequestBody Comment comment) {
        try {
            Comment updatedComment = commentService.updateCommentById(commentId, comment);
            return ResponseEntity.ok(updatedComment);
        }catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }



    @DeleteMapping ("/deleteComment/{uuid_Comment}")
    void deleteComment (@PathVariable UUID uuid_Comment) {
        commentService.deleteComment(uuid_Comment);

    }
    @GetMapping ("/getAllComment")
    public List<Comment> getAllComment() {
        return commentService.getAllComments();
    }

    @GetMapping("/getCommentById/{uuid_comment}")
    Comment getCommentById(@PathVariable UUID uuid_comment) {
        System.out.println("Get comment by id: " + uuid_comment);
        return commentService.getCommentById(uuid_comment);
    }
    @PostMapping("/ajouterCommentEtAffecterPost/{postId}/{userUuid}")
    public Comment ajouterCommentEtAffecterPost(@PathVariable UUID postId, @PathVariable UUID userUuid, @RequestBody Comment comment) {
        return commentService.ajouterCommentEtAffecterPost(comment, postId, userUuid);
    }

    @GetMapping("/getCommentsByPostId/{idPost}")
    List<Comment> findByPostId(@PathVariable UUID idPost) {
        return commentService.findByPostIdPost(idPost);
    }
}
