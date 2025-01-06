const mysql = require('mysql2/promise');

// Default Read Queries
const READ_QUERIES = [
    'SELECT * FROM Indicators WHERE id = 1;',
    'SELECT * FROM MotorData WHERE id = 1;',
    'SELECT * FROM MotorSettings WHERE id = 1;'
];

// Simulation values
const THRESHOLD = 0.001; // To assume 0 at threshold
const RPM_PER_STEP = 200; // since 4 settings and max rpm is 800 rpm, so 200 rpm per level

/**
 * Grabs the latest data from the database
 * 
 * @param {mysql.Pool} mysqlDB the database connection pool
 * 
 * @returns {Object} data from database
 */
async function grabLatestData(mysqlDB) {
    // Make promises with read request
    let promises = READ_QUERIES.map((sql) => mysqlDB.query(sql));
    let results = await Promise.all(promises);

    // Return
    return {
        indicators: results[0][0][0],
        motorData: results[1][0][0],
        motorSettings: results[2][0][0]
    };
}

/**
 * Runs one step in the motor simulation
 * 
 * @param {mysql.Pool} mysqlDB the database connection pool
 * @param {Object} initData the initial data at the start of the simulation
 * 
 * @returns {Object} the data after the simulation
 */
function runSimulation(mysqlDB, initData) {
    // Fast clone
    let finalData = JSON.parse(JSON.stringify(initData));
    
    // Update motor data (minimize database calls when not needed)
    let dataUpdated = false;

    // Speed adjustment (Accounts for battery level and charge mode)
    let targetSpeed = initData.motorData.BatteryLevel > THRESHOLD ? Number(initData.motorSettings.ChargeMode == 0) * initData.motorSettings.MotorSpeed * RPM_PER_STEP : 0;
    if (Math.abs(initData.motorData.MotorSpeed - targetSpeed) > THRESHOLD) {
        // Realistic speed adjustment
        let deltaSpeed = (targetSpeed - initData.motorData.MotorSpeed)/10;
        finalData.motorData.MotorSpeed += deltaSpeed;
        dataUpdated = true;
    }

    // Power adjustment (Switch targets depending on charge mode)
    let targetPower = initData.motorSettings.ChargeMode == 0 ? targetSpeed * 1.25 : -1000;
    if (Math.abs(initData.motorData.MotorPower - targetPower) > THRESHOLD) {
        // Realistic power adjustment
        let deltaPower = (targetPower - initData.motorData.MotorPower)/10;
        finalData.motorData.MotorPower += deltaPower;
        dataUpdated = true;
    }

    // Battery level adjustment
    if (initData.motorSettings.MotorSpeed != 0 || initData.motorSettings.ChargeMode == 1) {
        // Different behaviour depending on charging
        let deltaBattery = 0.1 * initData.motorData.MotorPower/1000;
        finalData.motorData.BatteryLevel -= deltaBattery;

        // If less than 0 or more than 100, basically battery level did not change
        if (finalData.motorData.BatteryLevel > 100) {
            finalData.motorData.BatteryLevel = 100;
        }else if (finalData.motorData.BatteryLevel < 0) {
            finalData.motorData.BatteryLevel = 0;
        }else{
            dataUpdated = true;
        }
    }

    // Battery temp adjustment
    // Different behaviour depending on power level (0.001 heat dissipation in relation with room temp)
    let deltaBatteryTemp = 0.01 * Math.abs(initData.motorData.MotorSpeed)/800 - 0.001 * (initData.motorData.BatteryTemp - 25);
    finalData.motorData.BatteryTemp += deltaBatteryTemp;

    // If less than room temp, assume stablized
    if (finalData.motorData.BatteryTemp < 25) {
        finalData.motorData.BatteryTemp = 25;
    }else{
        dataUpdated = true;
    }

    // Update indicators if needed
    finalData.indicators.MotorStatus = Number(finalData.motorData.MotorSpeed >= 700);
    finalData.indicators.LowBattery = Number(finalData.motorData.BatteryLevel <= 20);

    // Database updates
    // Need to update MotorData check
    if (dataUpdated) {
        mysqlDB.query(`UPDATE MotorData SET 
            MotorSpeed = ${finalData.motorData.MotorSpeed},
            MotorPower = ${finalData.motorData.MotorPower},
            BatteryLevel = ${finalData.motorData.BatteryLevel},
            BatteryTemp = ${finalData.motorData.BatteryTemp}
        WHERE id = 1;`);
    }
    // Need to update Indicators check
    if (
        initData.indicators.MotorStatus != finalData.indicators.MotorStatus ||
        initData.indicators.LowBattery != finalData.indicators.LowBattery
    ) {
        mysqlDB.query(`UPDATE Indicators SET 
            MotorStatus = ${finalData.indicators.MotorStatus == 1},
            LowBattery = ${finalData.indicators.LowBattery == 1}
        WHERE id = 1;`);
    }

    return finalData;
}

exports.grabLatestData = grabLatestData;
exports.runSimulation = runSimulation;