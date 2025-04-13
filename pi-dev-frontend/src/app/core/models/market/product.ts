export interface Product {
    uuid_product: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    isAvailable: boolean;
    imageUrl: string;
    productCategory?: ProductCategory;
    farmer?: Farmer;
  }
  
  export interface ProductCategory {
    uuid_category: string;
    name: string;
    description: string;
  }
  
  export interface Farmer {
    uuid_farmer: string;
    name: string;
    contactInfo: string;
  }