export interface Booking {
  id: string;
  date: string; // YYYY-MM-DD format
  timeSlot: string; // e.g., "09:00-10:00"
  name: string;
  email: string;
  phone: string;
  notes?: string;
  createdAt: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface Settings {
  businessHours: {
    startTime: string; // e.g., "09:00"
    endTime: string; // e.g., "18:00"
  };
  timeInterval: number; // minutes, e.g., 60
  businessName: string;
  contactEmail: string;
  contactPhone: string;
  advanceBookingHours: number; // minimum hours in advance for booking
  theme: 'light' | 'dark' | 'system';
  emailNotifications: boolean;
  calendarView: 'single' | 'dual'; // single month or dual months view
}
