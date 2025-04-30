import { Reaction } from './Reaction';

export interface Post {
   idPost?: string;  
   
   title: string;
   content: string;
   mediaUrl: string;
   createdAt?: Date | string;
   updatedAt?: Date | string;
   posterId?: string;
   isPoster?: boolean;
   comments?: Comment[];
   reactions?: Reaction[];
}

