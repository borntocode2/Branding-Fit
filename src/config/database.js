const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '../../data/branding_fit.db');
const dbDir = path.dirname(dbPath);

// Ensure the data directory exists
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Connect to SQLite Database
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Failed to connect to SQLite Database:', err.message);
    } else {
        console.log('✔ Connected to SQLite Database successfully.');
        initializeDatabase();
    }
});

function addColumnIfMissing(tableName, columnName, definition) {
    db.all(`PRAGMA table_info(${tableName})`, (err, columns) => {
        if (err) {
            console.error(`❌ Error reading "${tableName}" schema:`, err.message);
            return;
        }

        const exists = columns.some(column => column.name === columnName);
        if (exists) return;

        db.run(`ALTER TABLE ${tableName} ADD COLUMN ${definition}`, (alterErr) => {
            if (alterErr) console.error(`❌ Error adding "${columnName}" column:`, alterErr.message);
            else console.log(`✔ "${columnName}" column verified/created.`);
        });
    });
}

function initializeDatabase() {
    db.serialize(() => {
        // Create users table
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email VARCHAR(100) UNIQUE NOT NULL,
                nickname VARCHAR(50) NOT NULL,
                provider VARCHAR(20) NOT NULL,
                provider_id VARCHAR(100) NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `, (err) => {
            if (err) {
                console.error('❌ Error creating "users" table:', err.message);
            } else {
                console.log('✔ "users" table verified/created.');
                addColumnIfMissing('users', 'profile_image', 'profile_image TEXT');
            }
        });

        // Create brands table
        db.run(`
            CREATE TABLE IF NOT EXISTS brands (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                brand_name VARCHAR(100) NOT NULL,
                industry VARCHAR(50) NOT NULL,
                keywords TEXT NOT NULL,
                usp TEXT,
                target_age VARCHAR(30),
                persona TEXT,
                slogan VARCHAR(255),
                primary_color VARCHAR(7) DEFAULT '#6366F1',
                secondary_color VARCHAR(7) DEFAULT '#818CF8',
                point_color VARCHAR(7) DEFAULT '#4F46E5',
                font_title VARCHAR(100),
                font_body VARCHAR(100),
                logo_url TEXT,
                mockup_urls TEXT,
                guidebook_content TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(user_id) REFERENCES users(id)
            )
        `, (err) => {
            if (err) {
                console.error('❌ Error creating "brands" table:', err.message);
            } else {
                console.log('✔ "brands" table verified/created.');
                addColumnIfMissing('brands', 'mockup_urls', 'mockup_urls TEXT');
                addColumnIfMissing('brands', 'guidebook_content', 'guidebook_content TEXT');
            }
        });

        // Create design request table
        db.run(`
            CREATE TABLE IF NOT EXISTS design_requests (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(150) NOT NULL,
                attachment_name TEXT,
                brand_name VARCHAR(100),
                content TEXT NOT NULL,
                privacy_agreed INTEGER NOT NULL DEFAULT 0,
                status VARCHAR(30) DEFAULT 'received',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(user_id) REFERENCES users(id)
            )
        `, (err) => {
            if (err) {
                console.error('❌ Error creating "design_requests" table:', err.message);
            } else {
                console.log('✔ "design_requests" table verified/created.');
                addColumnIfMissing('design_requests', 'phone', 'phone VARCHAR(50)');
                addColumnIfMissing('design_requests', 'brand_name', 'brand_name VARCHAR(100)');
            }
        });
    });
}

module.exports = db;
