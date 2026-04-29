const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const fs = require('fs');
require('dotenv').config();

const app = express();

// --- MIDDLEWARE ---
app.use(cors({
    origin: ['http://localhost:5174', 'http://localhost:5173'], // Ensure this matches your terminal output
    credentials: true
}));
app.use(express.json());

// --- DATABASE CONNECTION (Aiven) ---
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME, // This will use 'mystay_db'
    ssl: {
        ca: fs.existsSync('./ca.pem') ? fs.readFileSync('./ca.pem') : undefined,
        ca: fs.readFileSync('./ca.pem'),
        rejectUnauthorized: false,
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
});

// Test connection on startup
pool.getConnection()
    .then(conn => {
        console.log("✅ Database Connected to Aiven Cloud");
        conn.release();
    })
    .catch(err => {
        console.error("❌ DB Connection Failed:", err.message);
    });

// --- ATTACH POOL TO REQ ---
app.use((req, res, next) => {
    req.pool = pool;
    next();
});

// --- ROUTES ---
const authRoutes = require('./routes/auth');
const stayRoutes = require('./routes/stayRoutes');
const reviewRoutes = require('./routes/reviewRoutes'); // 1. Import your new review routes
const bookingRoutes = require('./routes/bookingRoutes'); // 3. Import booking routes

app.use('/api/auth', authRoutes);
app.use('/api/stays', stayRoutes);
app.use('/api/reviews', reviewRoutes); // 2. Register the review endpoint
app.use('/api/bookings', bookingRoutes); // 4. Register the booking endpoint

// --- START SERVER ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 MyStay Server running on http://localhost:${PORT}`);
});