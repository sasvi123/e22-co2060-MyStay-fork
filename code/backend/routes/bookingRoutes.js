const express = require('express');
const router = express.Router();

// POST - Submit a booking request
router.post('/add', async (req, res) => {
    const { student_id, listing_id } = req.body;

    console.log("📥 New Booking Request:", { student_id, listing_id });

    try {
        // Validation
        if (!student_id || !listing_id) {
            return res.status(400).json({ error: "student_id and listing_id are required." });
        }

        // Validate user existence and role
        const [userCheck] = await req.pool.query('SELECT id, role FROM Users WHERE id = ?', [student_id]);
        if (userCheck.length === 0) {
            return res.status(404).json({ error: "User not found." });
        }
        
        // Prevent landlords/admins from booking if necessary (optional rule, but good practice)
        if (userCheck[0].role === 'landlord') {
            return res.status(403).json({ error: "Landlords cannot book listings." });
        }

        // Check if a pending or approved booking already exists for this user and listing
        const [existingBooking] = await req.pool.query(
            "SELECT * FROM Booking_Requests WHERE student_id = ? AND listing_id = ? AND status IN ('pending', 'approved')", 
            [student_id, listing_id]
        );
        
        if (existingBooking.length > 0) {
            return res.status(400).json({ error: "You already have a pending or approved booking for this listing." });
        }

        // Insert into Booking_Requests table
        const query = "INSERT INTO Booking_Requests (student_id, listing_id, status) VALUES (?, ?, 'pending')";
        await req.pool.query(query, [student_id, listing_id]);

        // Update the listing's availability to 'Booked'
        await req.pool.query("UPDATE Stays SET availability = 'Booked' WHERE stay_id = ?", [listing_id]);

        console.log("✅ Booking request successfully saved and listing marked as Booked.");
        res.status(201).json({ message: "Booking request submitted successfully!" });

    } catch (err) {
        console.error("❌ Database Error:", err.message);
        
        // Handle Foreign Key error if listing doesn't exist
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({ error: "This listing does not exist in the database." });
        }

        res.status(500).json({ error: "Internal Server Error: " + err.message });
    }
});

// GET - Fetch bookings for a specific user (student)
router.get('/student/:student_id', async (req, res) => {
    const { student_id } = req.params;
    
    try {
        const query = `
            SELECT b.request_id, b.status, b.request_date, s.stay_id, s.title, s.price, s.address, s.image_url
            FROM Booking_Requests b
            JOIN Stays s ON b.listing_id = s.stay_id
            WHERE b.student_id = ?
            ORDER BY b.request_date DESC`;

        const [rows] = await req.pool.query(query, [student_id]);
        res.json(rows);

    } catch (err) {
        console.error("❌ Fetch Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
