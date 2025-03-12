package cloud.hustler.pidevbackend.controllers;

import cloud.hustler.pidevbackend.entity.Comment;
import cloud.hustler.pidevbackend.entity.Post;
import cloud.hustler.pidevbackend.service.ICommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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


    @PutMapping("/deleteComment/{uuid_Comment}")
    void deleteComment (@PathVariable long uuid_Comment) {
        commentService.deleteComment(uuid_Comment);

    }
}
