
import pg from 'pg';
const { Pool } = pg;

const connectionString = 'postgresql://aztec_cloud_user:ycg8bBjkggSYPbwcuzHg4wfxeAFUO9rG@dpg-d5inptn5r7bs73di2iqg-a.virginia-postgres.render.com/aztec_cloud?ssl=true';

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

const INITIAL_ROOMS = [
  { id: '101', name: 'Green Orchid (101)', type: 'Private with Toilet', basePrice: 450, hasToilet: true, capacity: 1 },
  { id: '102', name: 'Orange Zest (102)', type: 'Private with Toilet', basePrice: 450, hasToilet: true, capacity: 1 },
  { id: '103', name: 'Red Chili (103)', type: 'Private with Toilet', basePrice: 450, hasToilet: true, capacity: 1 },
  { id: '201', name: 'Bamboo Suite (201)', type: 'Private (No Toilet)', basePrice: 375, hasToilet: false, capacity: 1 },
  { id: '202', name: 'Curry Leaf (202)', type: 'Private (No Toilet)', basePrice: 375, hasToilet: false, capacity: 1 },
  { id: '203', name: 'Lemongrass (203)', type: 'Private (No Toilet)', basePrice: 375, hasToilet: false, capacity: 1 },
  { id: '204', name: 'Tamarind (204)', type: 'Private (No Toilet)', basePrice: 375, hasToilet: false, capacity: 1 },
  { id: '205', name: 'Galangal (205)', type: 'Private (No Toilet)', basePrice: 375, hasToilet: false, capacity: 1 },
  { id: '206', name: 'Coconut (206)', type: 'Private (No Toilet)', basePrice: 375, hasToilet: false, capacity: 1 },
];

async function setup() {
  const client = await pool.connect();
  try {
    console.log('Connected to database...');

    // Drop tables if they exist
    await client.query('DROP TABLE IF EXISTS greencurry_bookings');
    await client.query('DROP TABLE IF EXISTS greencurry_rooms');
    await client.query('DROP TABLE IF EXISTS greencurry_users');

    // Create Users Table
    await client.query(`
      CREATE TABLE greencurry_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL
      )
    `);
    console.log('Created greencurry_users table');

    // Create Rooms Table
    await client.query(`
      CREATE TABLE greencurry_rooms (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(100) NOT NULL,
        base_price INTEGER NOT NULL,
        has_toilet BOOLEAN NOT NULL,
        capacity INTEGER NOT NULL
      )
    `);
    console.log('Created greencurry_rooms table');

    // Create Bookings Table
    await client.query(`
      CREATE TABLE greencurry_bookings (
        id VARCHAR(255) PRIMARY KEY,
        room_id VARCHAR(50) REFERENCES greencurry_rooms(id),
        guest_name VARCHAR(255) NOT NULL,
        guest_email VARCHAR(255) NOT NULL,
        guest_phone VARCHAR(50) NOT NULL,
        check_in DATE NOT NULL,
        check_out DATE NOT NULL,
        status VARCHAR(50) NOT NULL,
        notes TEXT,
        price_paid INTEGER
      )
    `);
    console.log('Created greencurry_bookings table');

    // Seed Admin User
    await client.query(`
      INSERT INTO greencurry_users (username, password, role)
      VALUES ($1, $2, $3)
    `, ['admin', 'curry123#', 'admin']);
    console.log('Seeded admin user');

    // Seed Rooms
    for (const room of INITIAL_ROOMS) {
      await client.query(`
        INSERT INTO greencurry_rooms (id, name, type, base_price, has_toilet, capacity)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [room.id, room.name, room.type, room.basePrice, room.hasToilet, room.capacity]);
    }
    console.log(`Seeded ${INITIAL_ROOMS.length} rooms`);

  } catch (err) {
    console.error('Error setting up database:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

setup();
