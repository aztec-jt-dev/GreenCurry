
import { RoomType, Room } from './types';

export const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'curry123#'
};

// Festival dates for dynamic pricing (YYYY-MM-DD range)
export const FESTIVALS = [
  { name: 'Songkran (Thai New Year)', start: '2025-04-12', end: '2025-04-16', multiplier: 1.5 },
  { name: 'Loy Krathong / Yi Peng', start: '2025-11-04', end: '2025-11-06', multiplier: 1.4 },
  { name: 'Christmas & New Year', start: '2025-12-24', end: '2026-01-02', multiplier: 1.3 },
];

export const INITIAL_ROOMS: Room[] = [
  { id: '101', name: 'Green Orchid (101)', type: RoomType.PRIVATE_WITH_TOILET, basePrice: 450, hasToilet: true, capacity: 1 },
  { id: '102', name: 'Orange Zest (102)', type: RoomType.PRIVATE_WITH_TOILET, basePrice: 450, hasToilet: true, capacity: 1 },
  { id: '103', name: 'Red Chili (103)', type: RoomType.PRIVATE_WITH_TOILET, basePrice: 450, hasToilet: true, capacity: 1 },
  { id: '201', name: 'Bamboo Suite (201)', type: RoomType.PRIVATE_NO_TOILET, basePrice: 375, hasToilet: false, capacity: 1 },
  { id: '202', name: 'Curry Leaf (202)', type: RoomType.PRIVATE_NO_TOILET, basePrice: 375, hasToilet: false, capacity: 1 },
  { id: '203', name: 'Lemongrass (203)', type: RoomType.PRIVATE_NO_TOILET, basePrice: 375, hasToilet: false, capacity: 1 },
  { id: '204', name: 'Tamarind (204)', type: RoomType.PRIVATE_NO_TOILET, basePrice: 375, hasToilet: false, capacity: 1 },
  { id: '205', name: 'Galangal (205)', type: RoomType.PRIVATE_NO_TOILET, basePrice: 375, hasToilet: false, capacity: 1 },
  { id: '206', name: 'Coconut (206)', type: RoomType.PRIVATE_NO_TOILET, basePrice: 375, hasToilet: false, capacity: 1 },
];

export const COUNTRY_CODES = [
  { code: '+66', country: 'Thailand' },
  { code: '+1', country: 'USA' },
  { code: '+44', country: 'UK' },
  { code: '+61', country: 'Australia' },
  { code: '+49', country: 'Germany' },
  { code: '+33', country: 'France' },
  { code: '+81', country: 'Japan' },
  { code: '+82', country: 'South Korea' },
  { code: '+86', country: 'China' },
  { code: '+65', country: 'Singapore' },
];

export const IMAGES = [
  'input_file_0.png',
  'input_file_1.png',
  'input_file_2.png',
  'input_file_3.png'
];
