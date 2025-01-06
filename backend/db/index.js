require('dotenv').config();

const mysql = require('mysql2/promise');

const fs = require('fs');

// Setup DB Pool Connection
const mysqlDB = mysql.createPool({
    host: process.env.DBURL,
    port: process.env.DBPORT,
    user: process.env.DBUSER,
    password: process.env.DBPASS,
    database: process.env.DBNAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Read all sql files from the db folder
const sql_files = fs.readdirSync('./db').filter(file => file.endsWith('.sql'));

// Run every SQL
let table_creation = sql_files.map((file) => {
    // Grab SQL from file
    const sql = fs.readFileSync(`./db/${file}`, 'utf8');

    // Create table if not already exists
    return mysqlDB.query(sql).then(() => {
        console.log("Table created if it did not exist");

        // Truncate table if exists
        mysqlDB.query(`TRUNCATE TABLE ${file.split('.')[0]};`).then(() => {
            console.log("Table truncated");
        });
    });
});

// Add default values to each tables;
Promise.all(table_creation).then(() => {
    console.log("All tables created");

    // Insert default values
    Promise.all([
        mysqlDB.query('INSERT INTO Indicators (ParkingBreak, CheckEngine, MotorStatus, LowBattery) VALUES (true, false, false, false);'),
        mysqlDB.query('INSERT INTO MotorData (GearRatio, BatteryLevel, BatteryTemp, MotorSpeed, MotorPower) VALUES ("1/2", 100.0, 25.0, 0.0, 0.0);'),
        mysqlDB.query('INSERT INTO MotorSettings (MotorSpeed, ChargeMode) VALUES (0, false);')
    ]).then(() => {
        // Close the connection
        mysqlDB.end().then(() => {
            console.log("Finished successfully");
        });
    });
});
