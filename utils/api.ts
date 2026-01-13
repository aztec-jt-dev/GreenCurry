
import { User, Room, Booking } from '../types';

const API_BASE = '/api';

export const api = {
  // Auth
  login: async (credentials: any): Promise<User> => {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    if (!res.ok) throw new Error('Login failed');
    return res.json();
  },

  // Rooms
  getRooms: async (): Promise<Room[]> => {
    const res = await fetch(`${API_BASE}/rooms`);
    if (!res.ok) throw new Error('Failed to fetch rooms');
    return res.json();
  },

  // Bookings
  getBookings: async (): Promise<Booking[]> => {
    const res = await fetch(`${API_BASE}/bookings`);
    if (!res.ok) throw new Error('Failed to fetch bookings');
    return res.json();
  },

  createBooking: async (booking: Booking): Promise<void> => {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking)
    });
    if (!res.ok) throw new Error('Failed to create booking');
  },

  updateBooking: async (id: string, updates: Partial<Booking>): Promise<void> => {
    const res = await fetch(`${API_BASE}/bookings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update booking');
  },

  deleteBooking: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/bookings/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete booking');
  }
};
