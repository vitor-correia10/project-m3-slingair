'use strict';

const { reservations } = require('./test-data/reservations')
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { flights } = require('./test-data/flightSeating');
const { v4 } = require('uuid');
const flightSeating = require('./test-data/flightSeating');


const PORT = process.env.PORT || 8080;

const handleFlight = (req, res) => {
  const { flightNumber } = req.params;
  // get flights available
  // const allFlights = Object.keys(flights);
  // is flightNumber in the array?
  // console.log('REAL FLIGHT: ', allFlights.includes(flightNumber));
  if (flights[flightNumber]) {
    res.status(200).send(flights[flightNumber]);
  } else {
    res.status(400).send({ message: "Flight not Found" });
  }
};

const handleFlightsAvailable = (req, res) => {
  let flightsAvailable = Object.keys(flights);
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

  const findSeat = formData.seat;

  const findFlight = flights[formData.flight]

  findFlight.forEach((element) => {
    let seatId = element.id;

    if (seatId === formData.seat) {
      element.isAvailable = false;
    }
  });
  const findSeatBooked = findFlight.find(element => element === findSeat);
  console.log('Find Seat Booked:', findSeatBooked)
  res.send({ status: 'success' })
}

const viewReservations = (req, res) => {
  const reservation = reservations.find(
    reservation => reservation.seat === req.params.seat && reservation.flight === req.params.flight
  );
  if (reservation === undefined) {
    res.status(200).send([]);
  }
  else {
    res.status(200).send(reservation);
  }
}

const getReservation = (req, res) => {
  res.status(200).render('./seat-select/admin', {
    flightNames: Object.keys(flights),
    flights: flights,
  })
  console.log('******Testing:', Object.keys(flights))
}

// declare the 404 function
const handleFourOhFour = (req, res) => {
  res.status(404).send("I couldn't find what you're looking for.");
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
  .post('/reservations', makeReservation)
  .get('/reservations/:flight/:seat', viewReservations)
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
  .get("/admin", getReservation)

  // catch all endpoint that will send the 404 message.
  .get('*', handleFourOhFour)
  .use((req, res) => res.send('Not Found'))
  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
