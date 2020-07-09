const flightReserved = document.getElementById('flight');
const seat = document.getElementById('seat');
const userName = document.getElementById('name');
const userEmail = document.getElementById('email');
const userId = document.getElementById('id');
const reservationBox = document.getElementById('reservation-box');

let reservationEmail = location.search.split('=')[1];

const getReservations = async () => {
    const request = `/seat-select/view-reservation/${reservationEmail}`
    const response = await fetch(request)
    const data = await response.json()
    flightReserved.innerText = data.flight;
    seat.innerText = data.seat;
    userName.innerText = `${data.givenName} ${data.surname}`;
    userEmail.innerText = data.email;
    userId.innerText = data.id;
};
getReservations();

const handleViewReservation = (event) => {
    const reservedEmail = document.getElementById('reservedEmail');
    window.location.href = `/seat-select/view-reservation.html?email=${reservedEmail.value}`;
};