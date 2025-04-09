package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.entity.Post;
import cloud.hustler.pidevbackend.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service

public class PostServiceImplement implements IPostService {

    @Autowired
    private PostRepository postRepository;

    @Override
    public Post addPost(Post post) {
        return postRepository.save(post);
    }

    @Override
    public Post updatePost(Post post) {
        return postRepository.save(post);
    }

    @Override
    public void deletePost(UUID uuid_post) {
        postRepository.deleteById(uuid_post);



    }

    @Override
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    @Override
    public Post getPostById(UUID uuid_post) {
        return postRepository.findById(uuid_post).get();
    }
}
