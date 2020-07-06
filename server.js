'use strict';

const { reservations } = require('./test-data/reservations')
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { flights } = require('./test-data/flightSeating');
const { v4 } = require('uuid');


const PORT = process.env.PORT || 8080;

const handleFlight = (req, res) => {
  const { flightNumber } = req.params;
  // get flights available
  // const allFlights = Object.keys(flights);
  // is flightNumber in the array?
  // console.log('REAL FLIGHT: ', allFlights.includes(flightNumber));
  // console.log('Returning ------>', flights[flightNumber]);
  res.status(200).send(flights[flightNumber]);
};

const handleFlightsAvailable = (req, res) => {
  let flightsAvailable = Object.keys(flights);
  // console.log(flightsAvailable);
  res.status(200).send(flightsAvailable);
};

const makeReservation = (req, res) => {
  const formData = req.body;
  const reservation = {
    //generate random ID
    id: v4(),
    //bring all data from req.body
    ...formData
  }
  reservations.push(reservation)
  // console.log('***Reservations data array', reservations)

  res.send({ status: 'success' })
}

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
  .post('/reservations', makeReservation)
  .get('/seat-select/confirmed/:reservationEmail', (req, res) => {
    const emailReservation = req.params.reservationEmail;
    const reservation = reservations.find(reservation => reservation.email === emailReservation)
    res.send(reservation)
  })
  .get('/seat-select/view-reservation/:reservationEmail', (req, res) => {
    const emailReservation = req.params.reservationEmail;
    const reservation = reservations.find(reservation => reservation.email === emailReservation)
    res.send(reservation)
  })
  .use((req, res) => res.send('Not Found'))
  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
