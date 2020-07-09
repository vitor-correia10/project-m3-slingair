const flightInput = document.getElementById('flight');
const seatsDiv = document.getElementById('seats-section');
const confirmButton = document.getElementById('confirm-button');
const givenName = document.getElementById('givenName');
const surname = document.getElementById('surname');
const email = document.getElementById('email');
const viewReservationAdmin = document.getElementById("view-reservation-admin");

let reservationEmail = '';
let selection = '';

//Available flights
function getFlights() {
    fetch('/flights')
        .then((res) => res.json())
        .then((data) => {
            data.forEach((flightNumberAvailable) => {
                let thisFlight = document.createElement("option");
                thisFlight.innerText = flightNumberAvailable;
                flightInput.appendChild(thisFlight);
            })
        })
}
getFlights()

//Seats
const renderSeats = () => {
    seatsDiv.innerHTML = '';

    document.querySelector('.form-container').style.display = 'block';

    const alpha = ['A', 'B', 'C', 'D', 'E', 'F'];
    for (let r = 1; r < 11; r++) {
        const row = document.createElement('ol');
        row.classList.add('row');
        row.classList.add('fuselage');
        seatsDiv.appendChild(row);
        for (let s = 1; s < 7; s++) {
            const seatNumber = `${r}${alpha[s - 1]}`;
            const seat = document.createElement('li');

            // Two types of seats to render
            const seatOccupied = `<li><label class="seat"><span id="${seatNumber}" class="occupied">${seatNumber}</span></label></li>`;
            const seatAvailable = `<li><label class="seat"><input type="radio" name="seat" value="${seatNumber}" /><span id="${seatNumber}" class="avail">${seatNumber}</span></label></li>`;

            // TODO: render the seat availability based on the data...
            seat.innerHTML = seatAvailable;
            row.appendChild(seat);
        }
    }
};

const toggleFormContent = (event) => {
    event.preventDefault();
    const flightNumber = flightInput.value;
    console.log('toggleFormContent: ', flightNumber);
    fetch(`/flights/${flightNumber}`)
        .then((res) => res.json())
        .then((data) => {
            data.forEach((element) => {
                let seatId = element.id;
                let isSeatAvailable = element.isAvailable;

                if (!isSeatAvailable) {
                    document.getElementById(seatId).className = 'occupied';

                    document.getElementById(seatId).onclick = () => {
                        fetch(`/reservations/${flightNumber}/${seatId}`)
                            .then((res) => res.json())
                            .then((data) => {
                                if (data.email === undefined) {
                                    givenName.innerText = 'Missing data';
                                    surname.innerText = 'Missing data';
                                    email.innerText = 'Missing data';
                                    viewReservationAdmin.style.visibility = "hidden";
                                } else {
                                    givenName.innerText = data.givenName;
                                    surname.innerText = data.surname;
                                    email.innerText = data.email;
                                    viewReservationAdmin.style.visibility = "visible";
                                    //Redirect to view reservation by email
                                    viewReservationAdmin.onclick = function () {
                                        location.href = `/seat-select/view-reservation.html?email=${data.email}`;
                                    };
                                }
                            });
                    }
                }
            })
        });

    renderSeats();
};


flightInput.addEventListener('change', toggleFormContent);

const handlReservedInfo = (event) => {
    event.preventDefault();
    var form = document.getElementsByName("salesForm");

    let data = {
        flight: flight.value,
        givenName: givenName.value,
        surname: surname.value,
        email: email.value,
        seat: selection,
    }
    fetch(`/reservations/${seat}`, {
        method: 'Get',

    })
        .then((res) => res.json())
        .then((responseBody) => {
            const { status, error } = responseBody;
            if (status === 'success') {
                console.log(responseBody);
            } else if (error) {
                console.log(error);
            }
        });
};