const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware'); // Import the gatekeeper
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'mystay_listings',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
  }
});

const upload = multer({ storage: storage });


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

// GET single boarding place - PUBLIC
router.get('/:id', async (req, res) => {
    const pool = req.pool;
    try {
        const query = `
            SELECT S.*, U.name AS landlordName, U.email AS landlordContact 
            FROM Stays S 
            LEFT JOIN Users U ON S.landlord_id = U.id 
            WHERE S.stay_id = ?
        `;
        const [rows] = await pool.query(query, [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "Stay not found" });
        }
        const stay = rows[0];
        const formattedStay = {
            ...stay,
            latitude: parseFloat(stay.latitude),
            longitude: parseFloat(stay.longitude)
        };
        res.json(formattedStay);
    } catch (err) {
        console.error("Database Error:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

// POST /api/stays - Create a new boarding place
router.post('/', protect, upload.single('image'), async (req, res) => {
    const { title, description, price, address, latitude, longitude, roomType, gender, facilities, availability, map_url } = req.body;
    const pool = req.pool;
    const landlord_id = req.user.id; // From authMiddleware
    const image_url = req.file ? req.file.path : null; // Cloudinary URL

    // Basic validation
    if (!title || !price || !latitude || !longitude) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    //add map_url to columns and array of parameters
    try {
        const query = `
        
            INSERT INTO Stays 
            (title, description, price, address, latitude, longitude, landlord_id, roomType, gender, facilities, availability, map_url, image_url) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await pool.query(query, [
            title, description, price, address, latitude, longitude, landlord_id,
            roomType || 'Single',
            gender || 'Any',
            facilities || '',
            availability || 'Available',
            map_url || null, // Save null if empty
            image_url // Save cloudinary URL
        ]);

        res.status(201).json({
            message: "Listing created successfully!",
            stayId: result.insertId,
            image_url: image_url
        });
    } catch (err) {
        console.error("Create Stay Error:", err);
        res.status(500).json({ error: "Server error while saving listing" });
    }
});
// PUT /api/stays/:id - Update a boarding place
router.put('/:id', protect, upload.single('image'), async (req, res) => {
    const stayId = req.params.id;
    const { title, description, price, address, latitude, longitude, roomType, gender, facilities, availability, map_url } = req.body;
    const pool = req.pool;
    const landlord_id = req.user.id;
    const image_url = req.file ? req.file.path : null;

    try {
        // Verify ownership
        const [rows] = await pool.query('SELECT landlord_id FROM Stays WHERE stay_id = ?', [stayId]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "Stay not found" });
        }
        if (rows[0].landlord_id !== landlord_id) {
            return res.status(403).json({ error: "Not authorized to edit this listing" });
        }

        // Build update query dynamically based on whether image_url is provided
        let query;
        let queryParams;
        
        if (image_url) {
            query = `
                UPDATE Stays SET
                title = ?, description = ?, price = ?, address = ?, latitude = ?, longitude = ?, 
                roomType = ?, gender = ?, facilities = ?, availability = ?, map_url = ?, image_url = ?
                WHERE stay_id = ?
            `;
            queryParams = [
                title, description, price, address, latitude, longitude, 
                roomType, gender, facilities, availability, map_url || null, image_url, stayId
            ];
        } else {
            query = `
                UPDATE Stays SET
                title = ?, description = ?, price = ?, address = ?, latitude = ?, longitude = ?, 
                roomType = ?, gender = ?, facilities = ?, availability = ?, map_url = ?
                WHERE stay_id = ?
            `;
            queryParams = [
                title, description, price, address, latitude, longitude, 
                roomType, gender, facilities, availability, map_url || null, stayId
            ];
        }

        await pool.query(query, queryParams);
        res.json({ message: "Listing updated successfully" });
    } catch (err) {
        console.error("Update Stay Error:", err);
        res.status(500).json({ error: "Server error while updating listing" });
    }
});

// DELETE /api/stays/:id - Delete a boarding place
router.delete('/:id', protect, async (req, res) => {
    const stayId = req.params.id;
    const pool = req.pool;
    const landlord_id = req.user.id;

    try {
        // Verify ownership
        const [rows] = await pool.query('SELECT landlord_id FROM Stays WHERE stay_id = ?', [stayId]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "Stay not found" });
        }
        if (rows[0].landlord_id !== landlord_id) {
            return res.status(403).json({ error: "Not authorized to delete this listing" });
        }

        await pool.query('DELETE FROM Stays WHERE stay_id = ?', [stayId]);
        res.json({ message: "Listing deleted successfully" });
    } catch (err) {
        console.error("Delete Stay Error:", err);
        res.status(500).json({ error: "Server error while deleting listing" });
    }
});

module.exports = router;