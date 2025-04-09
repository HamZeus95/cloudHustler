import { Post } from './Post';

export enum TypeReaction {
  LIKE = 'LIKE',
  DISLIKE = 'DISLIKE',
  LOVE = 'LOVE'
}

export interface Reaction {
  reactionId: string;
  typeReaction: TypeReaction;
  post: Post;
}
