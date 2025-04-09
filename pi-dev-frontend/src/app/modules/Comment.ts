import { Post } from './Post';

export interface Comment {
  uuid_comment: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  post: Post;
}
