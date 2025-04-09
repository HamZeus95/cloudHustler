import { Comment } from './Comment';
import { Reaction } from './Reaction';

export interface Post {
    uuid_post?: string;
    title: string;
    content: string;
    mediaUrl: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    comments?: Comment[];
    reactions?: Reaction[];
  }
  