const mysql = require('mysql2/promise');
const fs = require('fs');
require('dotenv').config({ path: './code/backend/.env' });

async function checkDb() {
    try {
        const pool = mysql.createPool({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            ssl: {
                ca: fs.readFileSync('./code/backend/ca.pem'),
                rejectUnauthorized: false,
            }
        });
        const [rows] = await pool.query("SHOW TABLES LIKE 'Stays'");
        console.log("Stays table exists:", rows.length > 0);
        
        if (rows.length === 0) {
           console.log("Creating Stays table...");
           await pool.query(`CREATE TABLE Stays (
                stay_id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                price DECIMAL(10, 2) NOT NULL,
                address VARCHAR(255),
                latitude DECIMAL(10, 8),
                longitude DECIMAL(11, 8),
                landlord_id INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_stays_users_landlord FOREIGN KEY (landlord_id) REFERENCES Users(id) ON DELETE CASCADE
            )`);
           console.log("Created successfully");
        }
        process.exit(0);
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
}
checkDb();
