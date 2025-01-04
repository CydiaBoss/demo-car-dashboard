const express = require('express');
const expressWs = require('express-ws');

const mysql = require('mysql');

const sim = require('./simulation');

const app = express();
const port = 3000;

// Setup DB Connection
const mysqlDB = mysql.createConnection({
  host: process.env.DBURL,
  port: process.env.DBPORT,
  user: process.env.DBUSER,
  password: process.env.DBPASS,
  database: process.env.DBNAME
});
mysqlDB.connect();

// Sets up websocket stuff
expressWs(app);

// Grab latest data
let data = sim.grabLatestData(mysqlDB);
console.log(data);

// Websocket endpoint (To do real-time stuff)
app.ws('/', (ws, req) => {
  // Recieve messages from frontend
  ws.on('message', (msg) => {
    console.log('Received message from client: ', msg);

    // Convert to Object
    // Format: {motorSpeed: 0, chargeStatus: 0}
    payload = JSON.parse(msg);

    // Update motor speed if valid
    if (payload.motorSpeed !== undefined && typeof(payload.motorSpeed) == "number" && payload.motorSpeed >= 0 && payload.motorSpeed <= 4) {
      console.log('Updating motor speed to: ', payload.motorSpeed);
      mysqlDB.query('UPDATE MotorSettings SET MotorSpeed = ?;', [payload.motorSpeed], (err, results, fields) => {
        if (err) {
          console.log('Error updating motor speed: ', err);
          return;
        }

        console.log('Motor speed updated to ', payload.motorSpeed);
      });
    }

    // Update charge status if valid
    if (payload.chargeStatus !== undefined && typeof(payload.chargeStatus) == "number" && (payload.chargeStatus == 0 || payload.chargeStatus == 1)) {
      console.log('Updating charge status to: ', payload.chargeStatus);
      mysqlDB.query('UPDATE MotorSettings SET ChargeMode = ?;', [payload.chargeStatus == 1 ? "true" : "false"], (err, results, fields) => {
        if (err) {
          console.log('Error updating motor speed: ', err);
          return;
        }

        console.log('Motor speed updated to ', payload.motorSpeed);
      });
    }

  });

  // Run simulation and send real-time data to frontend
  simLoop = setInterval(() => {
    sim.runSim();
  }, 2500);

  // Close the connection
  ws.on('close', () => {
    console.log('Client disconnected');
    clearInterval(simLoop);
  });
});

// Runs the server
app.listen(port, () => {
    console.log(`Demo car dashboard backend listening on port ${port}`)
});

mysqlDB.end();