import { Livraison } from "./livraison";

export interface Facture {
  id?: number | undefined;
  dateEmission?: string;
  montantTotal?: number;
  statut?: string;
  livraison?: Livraison;
}
