const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware'); // Import the gatekeeper


// GET all boarding places - PUBLIC
router.get('/', async (req, res) => {
    const pool = req.pool;
    try {
        console.log(`Fetching all stays for browse page`);

        const [rows] = await pool.query('SELECT * FROM Stays');

        // Optional: Ensure latitude/longitude are sent as numbers if they come back as strings
        const formattedRows = rows.map(stay => ({
            ...stay,
            latitude: parseFloat(stay.latitude),
            longitude: parseFloat(stay.longitude)
        }));

        res.json(formattedRows);
    } catch (err) {
        console.error("Database Error:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

// POST /api/stays - Create a new boarding place
router.post('/', protect, async (req, res) => {
    const { title, description, price, address, latitude, longitude, roomType, gender, facilities, availability } = req.body;
    const pool = req.pool;
    const landlord_id = req.user.id; // From authMiddleware

    // Basic validation
    if (!title || !price || !latitude || !longitude) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const query = `
            INSERT INTO Stays 
            (title, description, price, address, latitude, longitude, landlord_id, roomType, gender, facilities, availability) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await pool.query(query, [
            title, description, price, address, latitude, longitude, landlord_id,
            roomType || 'Single',
            gender || 'Any',
            facilities || '',
            availability || 'Available'
        ]);

        res.status(201).json({
            message: "Listing created successfully!",
            stayId: result.insertId
        });
    } catch (err) {
        console.error("Create Stay Error:", err);
        res.status(500).json({ error: "Server error while saving listing" });
    }
});

module.exports = router;