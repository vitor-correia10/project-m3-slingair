'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { flights } = require('./test-data/flightSeating');

// import { v4 as uuidv4 } from 'uuid';
// v4();

const PORT = process.env.PORT || 8000;

const handleFlight = (req, res) => {
  const { flightNumber } = req.params;
  // get all flight numbers
  const allFlights = Object.keys(flights);
  // is flightNumber in the array?
  console.log('REAL FLIGHT: ', allFlights.includes(flightNumber));
};

const handleFlightsAvailable = (req, res) => {
  let flightsAvailable = Object.keys(flights);
  console.log(flightsAvailable);
  res.status(200).send(flightsAvailable);
};

express()
  .use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
  })
  .use(morgan('dev'))
  .use(express.static('public'))
  .use(bodyParser.json())
  .use(express.urlencoded({ extended: false }))

  // endpoints
  .get('/flights/', handleFlightsAvailable)
  .get('/flights/:flightNumber', handleFlight)
  // .get('reservations/:reservationId', (req, res) => { req.params.reservationId; })
  // .post('/users', handleUsers)
  .use((req, res) => res.send('Not Found'))
  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
