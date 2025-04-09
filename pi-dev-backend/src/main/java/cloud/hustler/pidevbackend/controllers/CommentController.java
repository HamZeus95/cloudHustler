package cloud.hustler.pidevbackend.controllers;

import cloud.hustler.pidevbackend.entity.Comment;
import cloud.hustler.pidevbackend.entity.Post;
import cloud.hustler.pidevbackend.service.ICommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping
public class CommentController {

    @Autowired
    ICommentService commentService;
    @PostMapping("/addComment")
    Comment addComment(@RequestBody Comment comment) {
        return commentService.addComment(comment);
    }




    @PutMapping("/updateComment")
    Comment updateComment(@RequestBody Comment comment) {
        return commentService.updateComment(comment);
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
}
