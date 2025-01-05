const express = require('express');
const expressWs = require('express-ws');

const mysql = require('mysql2/promise');

const sim = require('./simulation');

const app = express();
const port = 3000;

// Setup DB Connection Pool
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

// Sets up websocket stuff
expressWs(app);

// Websocket endpoint (To do real-time stuff)
app.ws('/data', (ws, req) => {
  // Connection Msg
  console.log("Client connected")

  // Recieve messages from frontend
  ws.on('message', (msg) => {
    console.log('Received message from client: ', msg);

    // Convert to Object
    // Format: {motorSpeed: 0, chargeStatus: 0}
    payload = JSON.parse(msg);

    // Update motor speed if valid
    if (payload.motorSpeed !== undefined && typeof(payload.motorSpeed) == "number" && payload.motorSpeed >= 0 && payload.motorSpeed <= 4) {
      console.log('Updating motor speed to: ', payload.motorSpeed);
      mysqlDB.query(`UPDATE MotorSettings SET MotorSpeed = ${payload.motorSpeed};`).then(() => {
        console.log('Updated motor speed to: ', payload.motorSpeed);
      });
    }

    // Update charge status if valid
    if (payload.chargeStatus !== undefined && typeof(payload.chargeStatus) == "number" && (payload.chargeStatus == 0 || payload.chargeStatus == 1)) {
      console.log('Updating charge status to: ', payload.chargeStatus);
      mysqlDB.query(`UPDATE MotorSettings SET ChargeMode = ${payload.chargeStatus == 1 ? "true" : "false"};`).then(() => {
        console.log('Updated charge status to: ', payload.chargeStatus);
      });
    }
  });

  // Keep sending "real-time" data to frontend
  simLoop = setInterval(async () => {
    data = await sim.grabLatestData(mysqlDB);

    // Run simulation with data
    

    ws.send(JSON.stringify(data));
  }, 10);

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