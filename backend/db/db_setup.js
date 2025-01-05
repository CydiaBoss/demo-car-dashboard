const fs = require('fs');
const mysql = require('mysql2');

// Setup DB Connection
const mysqlDB = mysql.createConnection({
    host: process.env.DBURL,
    port: process.env.DBPORT,
    user: process.env.DBUSER,
    password: process.env.DBPASS,
    database: process.env.DBNAME
});

// Start a transaction to make tables
mysqlDB.beginTransaction((err) => {
    if (err) {
        console.log('Error starting transaction: ', err);
        return;
    }

    // Read all sql files from the db folder
    const sql_files = fs.readdirSync('./db').filter(file => file.endsWith('.sql'));

    // Run every SQL
    sql_files.forEach(file => {
        // Grab SQL from file
        const sql = fs.readFileSync(`./db/${file}`, 'utf8');

        // Create table if not already exists
        mysqlDB.query(sql, (err, results, fields) => {
            if (err) {
                console.log('Error creating tables: ', err);
                mysqlDB.rollback();
                return;
            }

            console.log('Tables creation queued');
        });

        // Truncate table if exists
        mysqlDB.query(`TRUNCATE TABLE ${file.split('.')[0]};`, (err, results, fields) => {
            if (err) {
                console.log('Error truncating tables: ', err);
                mysqlDB.rollback();
                return;
            }

            console.log('Tables truncation queued');
        });
    });

    // Commit transaction
    mysqlDB.commit((err) => {
        if (err) {
            console.log('Error committing transaction: ', err);
            mysqlDB.rollback();
            return;
        }

        console.log('Transaction complete');

        // Add default values to each tables
        mysqlDB.query('INSERT INTO Indicators (ParkingBreak, CheckEngine, MotorStatus, LowBattery) VALUES (true, false, false, false);', (err, results, fields) => {
            if (err) {
                console.log('Error adding default values to Indicators: ', err);
                return;
            }

            console.log('Default values added to Indicators');
        });

        mysqlDB.query('INSERT INTO MotorData (GearRatio, BatteryLevel, BatteryTemp, MotorSpeed) VALUES ("1/2", 100.0, 25.0, 0.0);', (err, results, fields) => {
            if (err) {
                console.log('Error adding default values to MotorData: ', err);
                return;
            }

            console.log('Default values added to MotorData');
        });

        mysqlDB.query('INSERT INTO MotorSettings (MotorSpeed, ChargeMode) VALUES (0, false);', (err, results, fields) => {
            if (err) {
                console.log('Error adding default values to MotorSettings: ', err);
                return;
            }

            console.log('Default values added to MotorSettings');
        });

        // Close the connection
        mysqlDB.end((err) => {
            if (err) {
                console.log('Error closing connection: ', err);
                return;
            }

            console.log('Connection closed');   
        });
    });
});
