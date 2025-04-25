import { Livraison } from "./livraison";

export interface SuiviLivraison {
  id?: number;
  statut?: string;
  commentaire?: string;
  dateMaj?: string;
  livraison?: Livraison;
}
