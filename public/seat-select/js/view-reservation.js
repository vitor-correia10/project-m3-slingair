const flightReserved = document.getElementById('flight');
const seat = document.getElementById('seat');
const userName = document.getElementById('name');
const userEmail = document.getElementById('email');

let reservationEmail = location.search.split('=')[1];

// console.log(reservation);


const getReservations = async () => {
    const request = `/seat-select/view-reservation/${reservationEmail}`
    console.log(request)
    const response = await fetch(request)
    const data = await response.json()
    console.log(data)
    flightReserved.innerText = data.flight;
    seat.innerText = data.seat;
    userName.innerText = `${data.givenName} ${data.surname}`;
    userEmail.innerText = data.email;
};
getReservations();