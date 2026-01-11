
export enum RoomType {
  PRIVATE_WITH_TOILET = 'Private with Toilet',
  PRIVATE_NO_TOILET = 'Private (No Toilet)'
}

export interface Room {
  id: string;
  name: string;
  type: RoomType;
  basePrice: number; // The standard rate
  hasToilet: boolean;
  capacity: number;
}

export interface Booking {
  id: string;
  roomId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string; // ISO format
  checkOut: string; // ISO format
  status: 'confirmed' | 'cancelled' | 'pending';
  notes?: string;
  pricePaid?: number; // Store the dynamic price at time of booking
}

export interface User {
  username: string;
  role: 'admin' | 'guest';
}

export interface AiMessage {
  role: 'user' | 'model';
  text: string;
}
