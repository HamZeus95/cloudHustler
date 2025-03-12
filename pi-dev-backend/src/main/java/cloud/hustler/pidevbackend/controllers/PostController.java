package cloud.hustler.pidevbackend.controllers;


import cloud.hustler.pidevbackend.entity.Post;
import cloud.hustler.pidevbackend.entity.Reaction;
import cloud.hustler.pidevbackend.service.IPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping
public class PostController {
    @Autowired
    IPostService postService;

    @PostMapping("/addPost")
    Post addPost(@RequestBody Post post) {
        return postService.addPost(post);
    }



    @PutMapping("/updatePost")
   Post updatePost(@RequestBody Post post) {
        return postService.updatePost(post);
    }


    @PutMapping("/deletePost/{uuid_post}")
    void deletePost(@PathVariable long uuid_post) {
        postService.deletePost(uuid_post);
    }

}
