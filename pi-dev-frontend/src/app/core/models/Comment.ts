export interface commentaires {
  commentId?: string;
  content: string;
  commantairId?: string;  // Unique ID of the commenter
  commenterId?: string;   // Alternative property name that might be used
  isCommantair?: boolean; // Flag to indicate if current user is the commenter
  createdAt: string;
  updatedAt: string;
  idPost?: string;        // Si le commentaire stocke directement l'ID du post
  post?: { idPost: string };
}
