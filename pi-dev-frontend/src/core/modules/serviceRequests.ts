import { TypeStatus } from './typeStatus';

export interface ServiceRequest {
  uuid_serviceRequest: string; // optionnel car généré par backend
  status: TypeStatus;
  lettreMotivation: string; // Ajout du champ lettreMotivation
  uploadCv: string;
  score?:number
}