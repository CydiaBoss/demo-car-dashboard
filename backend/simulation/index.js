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
    
    // Update motor data
    let dataUpdated = false;

    // Speed adjustment (since 4 settings and max rpm is 800 rpm, so 200 rpm per level)
    let targetSpeed = initData.motorSettings.MotorSpeed * 200;
    if (initData.motorData.MotorSpeed != targetSpeed) {
        // Realistic speed adjustment
        let deltaSpeed = Math.round((targetSpeed - initData.motorData.MotorSpeed)/10);
        finalData.motorData.MotorSpeed += deltaSpeed;
        dataUpdated = true;
    }

    // Power adjustment
    let targetPower = (initData.motorSettings.ChargeMode == 0 ? 1 : -1) * targetSpeed * 1.25;
    if (initData.motorData.MotorSpeed != targetSpeed) {
        // Realistic power adjustment
        let deltaPower = Math.round((targetPower - initData.motorData.MotorPower)/10);
        finalData.motorData.MotorPower += deltaPower;
        dataUpdated = true;
    }

    // Battery adjustment
    if (Math.abs(initData.motorData.MotorPower) > 0) {
        // Battery level adjustment
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

        //Battery temp adjustment
        // Different behaviour depending on power level (0.001 heat dissipation in relation with room temp)
        let deltaBatteryTemp = 0.01 * Math.abs(initData.motorData.MotorPower)/1000 - 0.001 * (initData.motorData.BatteryTemp - 25);
        finalData.motorData.BatteryTemp += deltaBatteryTemp;

        // If less than room temp, assume plateaued
        if (finalData.motorData.BatteryTemp < 25) {
            finalData.motorData.BatteryTemp = 25;
        }else{
            dataUpdated = true;
        }
    }

    // Update indicators if needed
    finalData.indicators.ParkingBreak = Number(finalData.motorData.MotorSpeed == 0);
    finalData.indicators.MotorStatus = Number(finalData.motorData.MotorSpeed >= 700);
    finalData.indicators.LowBattery = Number(finalData.motorData.BatteryLevel <= 20);

    // Database updates
    // Need to update MotorData
    if (dataUpdated) {
        mysqlDB.query(`UPDATE MotorData SET 
            MotorSpeed = ${finalData.motorData.MotorSpeed},
            MotorPower = ${finalData.motorData.MotorPower},
            BatteryLevel = ${finalData.motorData.BatteryLevel},
            BatteryTemp = ${finalData.motorData.BatteryTemp}
        WHERE id = 1;`);
    }
    // Need to update Indicators
    if (
        initData.indicators.ParkingBreak != finalData.indicators.ParkingBreak ||
        initData.indicators.MotorStatus != finalData.indicators.MotorStatus ||
        initData.indicators.LowBattery != finalData.indicators.LowBattery
    ) {
        mysqlDB.query(`UPDATE Indicators SET 
            ParkingBreak = ${finalData.indicators.ParkingBreak == 1},
            MotorStatus = ${finalData.indicators.MotorStatus == 1},
            LowBattery = ${finalData.indicators.LowBattery == 1}
        WHERE id = 1;`);
    }

    return finalData;
}

exports.grabLatestData = grabLatestData;
exports.runSimulation = runSimulation;