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
        
        console.log("Checking if Reviews table has bad foreign key...");
        
        try {
            // First we try to drop it. If it doesn't exist, this will throw an error, which is fine
            await pool.query('ALTER TABLE Reviews DROP FOREIGN KEY Reviews_ibfk_1');
            console.log("✅ Successfully dropped old foreign key (Reviews_ibfk_1).");
        } catch (e) {
            console.log("⚠️ Could not drop Reviews_ibfk_1 (it may have already been dropped or has a different name):", e.message);
        }

        try {
            console.log("Cleaning up orphaned reviews...");
            const [result] = await pool.query('DELETE FROM Reviews WHERE listing_id NOT IN (SELECT stay_id FROM Stays)');
            console.log(`✅ Deleted ${result.affectedRows} orphaned reviews.`);

            // Then we add the new foreign key constraint
            await pool.query('ALTER TABLE Reviews ADD CONSTRAINT Reviews_ibfk_1 FOREIGN KEY (listing_id) REFERENCES Stays(stay_id) ON DELETE CASCADE');
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
