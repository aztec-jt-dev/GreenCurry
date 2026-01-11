
import { Room, Booking, RoomType } from '../types';
import { FESTIVALS } from '../constants';

export const getNightlyPrice = (room: Room, dateStr: string, allBookings: Booking[], totalRooms: number) => {
  let multiplier = 1.0;
  const date = new Date(dateStr);
  const isoDate = date.toISOString().split('T')[0];

  // 1. Festival Check
  const festival = FESTIVALS.find(f => isoDate >= f.start && isoDate <= f.end);
  if (festival) {
    multiplier = festival.multiplier;
  }

  // 2. Occupancy Check
  const dailyOccupancy = allBookings.filter(b => 
    b.status === 'confirmed' && 
    isoDate >= b.checkIn && 
    isoDate < b.checkOut
  ).length;

  const occupancyRate = dailyOccupancy / totalRooms;
  if (occupancyRate > 0.8) {
    multiplier *= 1.2; // High occupancy surcharge
  }

  return Math.round(room.basePrice * multiplier);
};

export const getTotalBookingPrice = (room: Room, checkIn: string, checkOut: string, allBookings: Booking[], totalRooms: number) => {
  if (!checkIn || !checkOut) return 0;
  
  let total = 0;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  
  for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
    total += getNightlyPrice(room, d.toISOString().split('T')[0], allBookings, totalRooms);
  }
  
  return total;
};
