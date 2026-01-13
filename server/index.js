
import express from 'express';
import cors from 'cors';
import pg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const connectionString = process.env.DATABASE_URL || 'postgresql://aztec_cloud_user:ycg8bBjkggSYPbwcuzHg4wfxeAFUO9rG@dpg-d5inptn5r7bs73di2iqg-a.virginia-postgres.render.com/aztec_cloud?ssl=true';
const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

// Health Check Endpoint
app.get('/health', async (req, res) => {
  try {
    // Check database connection
    await pool.query('SELECT 1');
    res.status(200).json({ status: 'healthy', database: 'connected' });
  } catch (err) {
    console.error('Health check failed:', err);
    res.status(503).json({ status: 'unhealthy', database: 'disconnected' });
  }
});

// API Routes

// Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query(
      'SELECT * FROM greencurry_users WHERE username = $1 AND password = $2',
      [username, password]
    );

    if (result.rows.length > 0) {
      const user = result.rows[0];
      res.json({ username: user.username, role: user.role });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Rooms
app.get('/api/rooms', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM greencurry_rooms ORDER BY id');
    // Map snake_case DB columns to camelCase JS props if needed, but for now we'll handle it on frontend or keep it simple
    // Actually, let's map it to match the existing frontend types to minimize refactoring there
    const rooms = result.rows.map(r => ({
      id: r.id,
      name: r.name,
      type: r.type,
      basePrice: r.base_price,
      hasToilet: r.has_toilet,
      capacity: r.capacity
    }));
    res.json(rooms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Bookings
app.get('/api/bookings', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM greencurry_bookings');
    const bookings = result.rows.map(b => ({
      id: b.id,
      roomId: b.room_id,
      guestName: b.guest_name,
      guestEmail: b.guest_email,
      guestPhone: b.guest_phone,
      checkIn: b.check_in,
      checkOut: b.check_out,
      status: b.status,
      notes: b.notes,
      pricePaid: b.price_paid
    }));
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create Booking
app.post('/api/bookings', async (req, res) => {
  const b = req.body;
  try {
    await pool.query(
      `INSERT INTO greencurry_bookings 
       (id, room_id, guest_name, guest_email, guest_phone, check_in, check_out, status, notes, price_paid)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [b.id, b.roomId, b.guestName, b.guestEmail, b.guestPhone, b.checkIn, b.checkOut, b.status, b.notes, b.pricePaid]
    );
    res.status(201).json({ message: 'Booking created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update Booking
app.put('/api/bookings/:id', async (req, res) => {
  const { id } = req.params;
  const b = req.body; // updates

  // Dynamic update query builder would be better, but for now we handle specific updates (mostly status/notes)
  // Or we can just do a simple patch for known fields.
  // The frontend calls `updateBooking(id, updates)`

  try {
    // Construct query dynamically
    const fields = [];
    const values = [];
    let idx = 1;

    if (b.status) { fields.push(`status = $${idx++}`); values.push(b.status); }
    if (b.notes) { fields.push(`notes = $${idx++}`); values.push(b.notes); }
    if (b.guestName) { fields.push(`guest_name = $${idx++}`); values.push(b.guestName); }
    // Add others if needed

    if (fields.length === 0) return res.sendStatus(200);

    values.push(id);
    const query = `UPDATE greencurry_bookings SET ${fields.join(', ')} WHERE id = $${idx}`;

    await pool.query(query, values);
    res.json({ message: 'Booking updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete Booking
app.delete('/api/bookings/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM greencurry_bookings WHERE id = $1', [id]);
    res.json({ message: 'Booking deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Serve Static Assets (Production)
// We assume 'dist' is in the project root, one level up from 'server'
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// SPA Catch-all
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
