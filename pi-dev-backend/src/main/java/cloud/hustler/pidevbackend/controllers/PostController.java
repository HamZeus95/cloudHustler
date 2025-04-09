package cloud.hustler.pidevbackend.controllers;

import cloud.hustler.pidevbackend.entity.Farmer;
import cloud.hustler.pidevbackend.entity.Post;
import cloud.hustler.pidevbackend.service.IPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/posts")  // Ajout du préfixe "/posts" pour mieux organiser les endpoints
public class PostController {

    @Autowired
    IPostService postService;


    // Ajouter un post
    @PostMapping("/addPost")
    public Post addPost(@RequestBody Post post) {
       return postService.addPost(post);
    }

    // Mettre à jour un post
    @PutMapping("/updatePost")
    public Post updatePost(@RequestBody Post post) {
        return postService.updatePost(post);
    }

    // Supprimer un post par UUID
    @DeleteMapping("/deletePost/{uuid_post}")
    public void deletePost(@PathVariable UUID uuid_post) {  // Change le type en UUID
        postService.deletePost(uuid_post);
    }

    // Récupérer tous les posts
    @GetMapping("/getAllPost")
    public List<Post> getAllPost() {
        return postService.getAllPosts();
    }

    // Récupérer un post par UUID
    @GetMapping("/getPostById/{uuid_post}")
    public Post getPostById(@PathVariable UUID uuid_post) {  // Change le type en UUID
        return postService.getPostById(uuid_post);
    }
}
