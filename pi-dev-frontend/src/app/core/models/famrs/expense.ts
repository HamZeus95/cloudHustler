export interface Expense {
    uuid_expense?: string; 
    expenseType?: string;
    amount?: number;
    date?:Date | string | null; 
    description?: string;
    farm_id?: string; 
  }