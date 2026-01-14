import pg from 'pg';
const { Pool } = pg;

// Use Railway's DATABASE_URL from environment
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error('ERROR: DATABASE_URL environment variable is not set!');
    console.log('Please run: railway run node scripts/setup-db-railway.js');
    process.exit(1);
}

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
        console.log('🔌 Connected to Railway PostgreSQL database...');
        console.log('📍 Database URL:', connectionString.split('@')[1]); // Hide credentials

        // Drop tables if they exist
        console.log('\n🗑️  Dropping existing tables...');
        await client.query('DROP TABLE IF EXISTS greencurry_bookings');
        await client.query('DROP TABLE IF EXISTS greencurry_rooms');
        await client.query('DROP TABLE IF EXISTS greencurry_users');
        console.log('✅ Old tables dropped');

        // Create Users Table
        console.log('\n📋 Creating greencurry_users table...');
        await client.query(`
      CREATE TABLE greencurry_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL
      )
    `);
        console.log('✅ Created greencurry_users table');

        // Create Rooms Table
        console.log('📋 Creating greencurry_rooms table...');
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
        console.log('✅ Created greencurry_rooms table');

        // Create Bookings Table
        console.log('📋 Creating greencurry_bookings table...');
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
        console.log('✅ Created greencurry_bookings table');

        // Seed Admin User
        console.log('\n👤 Seeding admin user...');
        await client.query(`
      INSERT INTO greencurry_users (username, password, role)
      VALUES ($1, $2, $3)
    `, ['admin', 'curry123#', 'admin']);
        console.log('✅ Admin user created (username: admin, password: curry123#)');

        // Seed Rooms
        console.log('\n🏨 Seeding rooms...');
        for (const room of INITIAL_ROOMS) {
            await client.query(`
        INSERT INTO greencurry_rooms (id, name, type, base_price, has_toilet, capacity)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [room.id, room.name, room.type, room.basePrice, room.hasToilet, room.capacity]);
        }
        console.log(`✅ Seeded ${INITIAL_ROOMS.length} rooms`);

        console.log('\n🎉 Database setup complete!');
        console.log('\n📊 Summary:');
        console.log('   - Users table: 1 admin user');
        console.log('   - Rooms table: 9 rooms');
        console.log('   - Bookings table: Ready for bookings');

    } catch (err) {
        console.error('\n❌ Error setting up database:', err);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

setup();
