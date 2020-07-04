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
  const allFlights = Object.keys(flights);
  // is flightNumber in the array?
  // console.log('REAL FLIGHT: ', allFlights.includes(flightNumber));
  // console.log('Returning ------>', flights[flightNumber]);
  res.status(200).send(flights[flightNumber]);
};

const handleFlightsAvailable = (req, res) => {
  let flightsAvailable = Object.keys(flights);
  console.log(flightsAvailable);
  res.status(200).send(flightsAvailable);
};

const makeReservation = (req, res) => {
  const formData = req.body;
  console.log(formData)
  const reservation = {
    id: v4(),
    ...formData
  }
  reservations.push(reservation)

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
  // .get('reservations/:reservationEmail', (req, res) => {
  //   const id = v4();
  //   const emailReservation = req.query.email;
  //   const givenName = req.query.givenName;
  //   const flight = req.query.flight;
  //   const surname = req.query.surname;
  //   const seatNumber = req.query.seat;

  //   res.render("./reservations/", { id, emailReservation, givenName, surname, flight, seatNumber })
  // })
  .get('/seat-select/confirmed/:reservationEmail', (req, res) => {
    console.log(reservations);
    console.log(req.params.reservationEmail);
    const emailReservation = req.params.reservationEmail;
    const reservation = reservations.find(reservation => reservation.email === emailReservation)
    res.send(reservation)
  })
  .post('/reservations', makeReservation)
  .use((req, res) => res.send('Not Found'))
  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
