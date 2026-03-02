// Type definitions for the application

// Example types
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Trip {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
}

// Add other types as needed
