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
        
        console.log("Describing Stays table...");
        const [rows] = await pool.query('DESCRIBE Stays');
        console.log(rows);
        
        const hasImageUrl = rows.some(r => r.Field === 'image_url');
        if (!hasImageUrl) {
            console.log("Adding image_url column...");
            await pool.query('ALTER TABLE Stays ADD COLUMN image_url VARCHAR(255)');
            console.log("Added image_url column.");
        } else {
            console.log("image_url column already exists.");
        }
        
        pool.end();
    } catch (e) {
        console.error(e);
    }
}
main();
