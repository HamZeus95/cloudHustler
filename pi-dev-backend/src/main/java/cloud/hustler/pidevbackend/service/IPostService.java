package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.entity.Post;

import java.util.List;
import java.util.UUID;

public interface IPostService {
    Post addPost(Post post);
    Post updatePost(Post post);
    void deletePost(UUID uuid_post);
    List<Post> getAllPosts();
    Post getPostById(UUID uuid_post);
    
}
