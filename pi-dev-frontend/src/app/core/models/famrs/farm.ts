import { Crop } from "./crop";

export interface Farm {
    uuid_farm: string;
    name: string;
    size: number;
    latitude: number;
    longitude: number;
    irrigation_type: string;
    farmer: any; // or a specific interface if you have it
    resources: any[];
    crops: Crop[];
    tasks: any[];
    expenses: any[];
  }