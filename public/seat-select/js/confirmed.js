const flightNum = document.getElementById('flight');
const seat = document.getElementById('seat');
const userName = document.getElementById('name');
const userEmail = document.getElementById('email');
const viewReservation = document.getElementById("view-reservation");

let reservationEmail = location.search.split('=')[1];

const getConfirmation = async () => {
    const request = `/seat-select/confirmed/${reservationEmail}`
    const response = await fetch(request)
    const data = await response.json()
    flightNum.innerText = data.flight;
    seat.innerText = data.seat;
    userName.innerText = `${data.givenName} ${data.surname}`;
    userEmail.innerText = data.email;
};
getConfirmation();

viewReservation.onclick = function () {
    location.href = `/seat-select/view-reservation.html?email=${reservationEmail}`;
};