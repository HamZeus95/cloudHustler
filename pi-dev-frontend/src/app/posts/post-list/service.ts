import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../../modules/Post';
import { commentaires } from 'src/app/modules/Comment';
import { Reaction } from 'src/app/modules/Reaction';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private baseUrl = 'http://localhost:8090/pi-dev-backend';
  constructor(private http: HttpClient) {}


  addCommentToPost(postId: string, comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(
      `${this.baseUrl}/ajouterCommentEtAffecterPost/${postId}`,
      comment
    );}


    addReactionToPost(postId: string, reaction: Reaction): Observable<Reaction> {
      return this.http.post<Reaction>(
        `${this.baseUrl}/ajouterReactionEtAffecterPost/${postId}`,
        reaction
      );}




  getAllPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseUrl}/posts/getAllPost`);
    

  }

  getPostById(id: string): Observable<Post> {
    return this.http.get<Post>(`${this.baseUrl}/posts/getPostById/${id}`);
  }

  addPost(post: Post): Observable<Post> {
    return this.http.post<Post>(`${this.baseUrl}/posts/addPost`, post);
  }
  

  updatePost(id: string, post: Post): Observable<Post> {
    return this.http.put<Post>(`${this.baseUrl}/posts/updatePostById/${id}`, post);
  }

  deletePost(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getCommentsByPostId(postId: string): Observable<commentaires[]> {
    return this.http.get<commentaires[]>(`${this.baseUrl}/getCommentsByPostId/${postId}`);
  }


}
