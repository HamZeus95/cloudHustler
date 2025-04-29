export class Event {
    
    uuid_event!: string;
    name!: string;
    description!: string;
    location!: string;
    banner!: string;
    startDate!: string; 
    endDate!: string;
    imgsUrls!: string[]; 
    participants: string[] =[];
    maxParticipants?: number;
    isOnline?: boolean;
    onlineLink?: string;
    nbrParticipants?: number ;
  
  
  }
  