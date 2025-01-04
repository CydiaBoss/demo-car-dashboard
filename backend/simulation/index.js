const util = require('util');
const mysql = require('mysql');

/**
 * Grabs the latest data from the database
 * 
 * @param {mysql.Connection} mysqlDB the database connection
 * 
 * @returns {Object} data from database
 */
function grabLatestData(mysqlDB) {
    // Data
    let data = {
        indicators: {
            ParkingBreak: false,
            CheckEngine: false,
            MotorStatus: false,
            LowBattery: false
        },
        motorData: {
            GearRatio: "1/2",
            BatteryLevel: 100.0,
            BatteryTemp: 25.0,
            MotorSpeed: 0.0
        },
        motorSettings: {
            MotorSpeed: 0,
            ChargeMode: false
        }
    };

    // Promisify query
    let queryPromise = util.promisify(mysqlDB.query)
    queryPromise.bind(mysqlDB);

    // Create query to read data
    mysqlDB.query('SELECT * FROM Indicators WHERE id = 1;', (err, results, fields) => {
        if (err) {
            console.log('Error retrieving values from Indicators: ', err);
            return;
        }

        // Save data
        data.indicators = results[0];
    });

    mysqlDB.query('SELECT * FROM MotorData WHERE id = 1;', (err, results, fields) => {
        if (err) {
            console.log('Error retrieving values from MotorData: ', err);
            return;
        }

        // Save data
        data.motorData = results[0];
    });

    mysqlDB.query('SELECT * FROM MotorSettings WHERE id = 1;', (err, results, fields) => {
        if (err) {
            console.log('Error retrieving values from MotorSettings: ', err);
            return;
        }

        // Save data
        data.motorSettings = results[0];
    });

    return data;
}

function runSim(mysqlDB) {
    console.log('Running simulation');
}

exports.grabLatestData = grabLatestData;
exports.runSim = runSim;