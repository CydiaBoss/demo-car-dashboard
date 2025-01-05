# Car Dashboard Demo Backend

This part of the repository contains the backend of the car dashboard interface.
It will talk with the frontend and database, and handle data and simulations with the data.

## Installation

NodeJS version 22.12.0 was used for this depolyment.
Clone the repo and run `npm install` in this directory to install all the dependencies.
Next, setup a database using MySQL. It can be local or from a cloud provider.

Create a `.env` file and add the following fields to it:
- DBURL: database host
- DBPORT: database host's port
- DBNAME: database's name
- DBUSER: username to database
- DBPASS: password associated to username to database

Once set up, run `npm run db` to set up the database schema and add default data.

## Start

When ready, the server can be run using `npm run dev`