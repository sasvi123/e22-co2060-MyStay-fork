const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware'); // Import the gatekeeper

// GET all boarding places - now PROTECTED
router.get('/', protect, async (req, res) => {
    const pool = req.pool;
    try {
        // Because of the middleware, we know req.user exists here!
        console.log(`User ${req.user.id} is viewing stays`);
        
        const [rows] = await pool.query('SELECT * FROM Stays');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;