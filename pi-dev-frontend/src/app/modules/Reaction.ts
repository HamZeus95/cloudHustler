import { Post } from './Post';

export enum TypeReaction {
  LIKE = 'LIKE',
  DISLIKE = 'DISLIKE',
  LOVE = 'LOVE'
}

export interface Reaction {
  uuid_reaction: string;
  typeReaction: TypeReaction;
  post: Post;
}
