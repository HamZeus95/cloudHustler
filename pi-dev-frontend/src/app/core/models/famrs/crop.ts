export interface Crop {
    uuid_crop?: string; 
    name?: string;
    plantingDate?: Date | string | null; 
    harvestDate?: Date | string | null;  
    expectedYield?: number;
    farm_id?: string; 
  }