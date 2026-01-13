
import { Booking, Room } from '../types';

/**
 * Simulates sending an email confirmation.
 * In a real app, this would call a backend API (SendGrid, Mailgun, etc.)
 */
export const sendMockConfirmationEmail = async (booking: Booking, room: Room): Promise<boolean> => {
  console.log("%c--- MOCK EMAIL SERVICE ---", "color: #8ec63f; font-weight: bold; font-size: 1.2rem;");
  console.log(`To: ${booking.guestEmail}`);
  console.log(`Subject: Sawadee-kap! Your stay at Green Curry Hostel is confirmed.`);
  console.log(`
    Hello ${booking.guestName},

    Spicy greetings from Chiang Mai! Your reservation for ${room.name} is confirmed.

    BOOKING DETAILS:
    - Confirmation ID: ${booking.id}
    - Check-in: ${booking.checkIn}
    - Check-out: ${booking.checkOut}
    - Total Paid: ${booking.pricePaid} THB

    We can't wait to welcome you to the Old City. If you have any questions,
    simply chat with our AI Concierge on our website or reply to this email.

    Warmly,
    The Green Curry Team
  `);
  console.log("%c---------------------------", "color: #8ec63f; font-weight: bold;");

  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), 1500);
  });
};
