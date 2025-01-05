const mysql = require('mysql2/promise');

// Default Read Queries
const READQUERIES = [
    'SELECT * FROM Indicators WHERE id = 1;',
    'SELECT * FROM MotorData WHERE id = 1;',
    'SELECT * FROM MotorSettings WHERE id = 1;'
];

/**
 * Grabs the latest data from the database
 * 
 * @param {mysql.Pool} mysqlDB the database connection pool
 * 
 * @returns {Object} data from database
 */
async function grabLatestData(mysqlDB) {
    // Make promises with read request
    let promises = READQUERIES.map((sql) => mysqlDB.query(sql));
    let results = await Promise.all(promises);

    // Return
    return {
        indicators: results[0][0][0],
        motorData: results[1][0][0],
        motorSettings: results[2][0][0]
    };
}

exports.grabLatestData = grabLatestData;