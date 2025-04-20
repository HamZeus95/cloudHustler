import { Order } from '../market/order.model';

export type LivraisonStatus = 'En attente' | 'En transit' | 'Livrée';

export interface DeliveryDriver {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
}

export interface Livraison {
  id: number;
  statut: string;
  adresseLivraison: string;
<<<<<<< Updated upstream
  dateLivraison: string;
=======
    dateLivraison: string;
>>>>>>> Stashed changes
  dateCreation: string;
  order?: Order;
  deliveryDriver?: DeliveryDriver;
}
