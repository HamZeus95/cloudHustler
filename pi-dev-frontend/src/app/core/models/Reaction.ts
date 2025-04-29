import { TypeReaction } from './TypeReaction';
import { Post } from './Post';

export interface Reaction {
  reactionId: string;
  typeReaction: TypeReaction;
  user?: { userUUID: string };
  post: Post;
}
