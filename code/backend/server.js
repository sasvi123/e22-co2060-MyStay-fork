const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const fs = require('fs');
require('dotenv').config();

const app = express();

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- DATABASE CONNECTION (Aiven) ---
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME, // This will use 'mystay_db'
    ssl: {
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

app.use('/api/auth', authRoutes);
app.use('/api/stays', stayRoutes);

// --- START SERVER ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 MyStay Server running on http://localhost:${PORT}`);
});