require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');

async function main() {
    try {
        const pool = mysql.createPool({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            ssl: {
                ca: fs.existsSync('./ca.pem') ? fs.readFileSync('./ca.pem') : undefined,
                rejectUnauthorized: false,
            }
        });
        
        console.log("Checking if Booking_Requests table has bad foreign key...");
        
        try {
            // Drop old fk
            await pool.query('ALTER TABLE Booking_Requests DROP FOREIGN KEY fk_listing');
            console.log("✅ Successfully dropped old foreign key (fk_listing).");
        } catch (e) {
            console.log("⚠️ Could not drop fk_listing (it may have already been dropped):", e.message);
        }

        try {
            console.log("Cleaning up orphaned bookings...");
            const [result] = await pool.query('DELETE FROM Booking_Requests WHERE listing_id NOT IN (SELECT stay_id FROM Stays)');
            console.log(`✅ Deleted ${result.affectedRows} orphaned bookings.`);

            // Add new fk pointing to Stays
            await pool.query('ALTER TABLE Booking_Requests ADD CONSTRAINT fk_listing FOREIGN KEY (listing_id) REFERENCES Stays(stay_id) ON DELETE CASCADE');
            console.log("✅ Successfully added new foreign key pointing to Stays(stay_id).");
        } catch (e) {
            console.log("⚠️ Could not add new foreign key constraint. Details:", e.message);
        }
        
        pool.end();
    } catch (e) {
        console.error("General Error:", e);
    }
}
main();
