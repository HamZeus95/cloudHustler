export interface Servicee {
    uuid_service?: string;  // L'UUID du service
    title: string;
    description: string;
    isHiring: boolean;
    category: string;
    salary: number;
    imageUrl: string;
    nbWorkers: number;
    quiz?:any;
    
  }