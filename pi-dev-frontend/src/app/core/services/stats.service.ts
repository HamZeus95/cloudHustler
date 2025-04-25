// stats.service.ts
import { Injectable } from '@angular/core';
import { Post } from '../models/Post';
import { commentaires } from '../models/Comment';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  calculateBasicStats(posts: Post[], comments: commentaires[]): {
    totalPosts: number;
    totalComments: number;
    avgCommentsPerPost: string;
  } {
    return {
      totalPosts: posts.length,
      totalComments: comments.length,
      avgCommentsPerPost: posts.length > 0 ? (comments.length / posts.length).toFixed(2) : '0'
    };
  }

  getTopCommentedPosts(posts: Post[], comments: commentaires[], limit = 5): any[] {
    return posts.map(post => {
      const postComments = comments.filter(c => (c as any).post?.idPost === post.idPost);
      return {
        ...post,
        commentCount: postComments.length
      };
    })
    .sort((a, b) => b.commentCount - a.commentCount)
    .slice(0, limit);
  }

  getRecentActivity(posts: Post[], comments: commentaires[], limit = 5): any[] {
    const allActivities = [
      ...comments.map(c => ({...c, type: 'comment', date: new Date((c as any).createdAt)}))
    ];
    
    return allActivities
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, limit);
  }

  getFullStats(posts: Post[], comments: commentaires[]): any {
    return {
      basic: this.calculateBasicStats(posts, comments),
      topPosts: this.getTopCommentedPosts(posts, comments),
      activity: this.getRecentActivity(posts, comments)
    };
  }
}