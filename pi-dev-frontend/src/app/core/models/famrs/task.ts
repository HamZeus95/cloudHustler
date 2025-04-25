export interface Task {
    uuid_task?: string;  // Make uuid_task optional
    title: string;
    description: string;
    status: 'TO_DO' | 'IN_PROGRESS' | 'DONE';
    startDate: string | null;  // Allow null for the start date
    endDate: string | null;    // Allow null for the end date
    farm: any;
  }
  