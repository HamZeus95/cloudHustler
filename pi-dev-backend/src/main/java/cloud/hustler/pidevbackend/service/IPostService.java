package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.entity.Comment;
import cloud.hustler.pidevbackend.entity.Post;

import java.util.List;
import java.util.UUID;

public interface IPostService {
    Post addPost(Post post);
    Post updatePost(Post post);
    void deletePostByIdWithCommentAndReaction(UUID postID);
    List<Post> getAllPosts();
    Post getPostById(UUID postId);
    Post updatePostById(UUID postId, Post postUpdates);
}
