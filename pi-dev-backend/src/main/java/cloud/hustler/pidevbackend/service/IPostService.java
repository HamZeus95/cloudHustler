package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.entity.Post;

import java.util.List;

public interface IPostService {
    Post addPost(Post post);
    Post updatePost(Post post);
    void deletePost(long uuid_post);
    List<Post> getAllPosts();
    Post getPostById(long uuid_post);
}
