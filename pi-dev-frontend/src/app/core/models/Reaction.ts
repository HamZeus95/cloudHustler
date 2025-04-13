import { Post } from './Post';
import { TypeReaction } from './TypeReaction';


export interface Reaction {
  reactionId: string;
  typeReaction: TypeReaction;
  post: Post;
}
