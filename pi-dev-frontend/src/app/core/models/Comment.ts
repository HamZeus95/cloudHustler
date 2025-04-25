
export interface commentaires {
  commentId?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  idPost?: string;        // Si le commentaire stocke directement l'ID du post
  post?: { idPost: string };
}
