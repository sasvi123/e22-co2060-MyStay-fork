const express = require('express');
const router = express.Router();

// GET all boarding places (stays)
router.get('/', async (req, res) => {
    const pool = req.pool;
    try {
        const [rows] = await pool.query('SELECT * FROM Stays');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;