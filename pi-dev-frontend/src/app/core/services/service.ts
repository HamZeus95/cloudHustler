import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../../core/models/Post';
import { commentaires } from 'src/app/core/models/Comment';
import { Reaction } from 'src/app/core/models/Reaction';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private baseUrl = `${environment.apiBaseUrl}`;

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

  getCommentById(commentId: string): Observable<commentaires> {
    return this.http.get<commentaires>(`${this.baseUrl}/getCommentById/${commentId}`);
  }


  getAllComment(): Observable<commentaires[]> {
    return this.http.get<commentaires[]>(`${this.baseUrl}/getAllComments`);
  }
  getCommentByPostId(postId: string): Observable<commentaires[]> {
    return this.http.get<commentaires[]>(`${this.baseUrl}/getCommentsByPostId/${postId}`);
  }

  getPostById(id: string): Observable<Post> {
    return this.http.get<Post>(`${this.baseUrl}/posts/getPostById/${id}`);
  }

  addPost(postData: FormData): Observable<Post> {
    return this.http.post<Post>(`${this.baseUrl}/posts/addPost`, postData);
  }
  

  updatePost(id: string, post: Post): Observable<Post> {
    return this.http.put<Post>(`${this.baseUrl}/posts/updatePostById/${id}`, post);
  }

  deletePost(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/posts/deletePost/${id}`);
  }

  deleteComment(id: string  ): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/deleteComment/${id}` );
  }

  
updateCommentById(commentId: string, comment: commentaires): Observable<commentaires> {
    return this.http.put<commentaires>(`${this.baseUrl}/updateCommentById/${commentId}`, comment);

}
}