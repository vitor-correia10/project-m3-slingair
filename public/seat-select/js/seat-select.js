const flightInput = document.getElementById('flight');
const seatsDiv = document.getElementById('seats-section');
const confirmButton = document.getElementById('confirm-button');
const givenName = document.getElementById('givenName');
const surname = document.getElementById('surname');
const email = document.getElementById('email');

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

  confirmButton.disabled = true;
  let seatMap = document.forms['seats'].elements['seat'];
  seatMap.forEach((seat) => {
    seat.onclick = () => {
      selection = seat.value;
      seatMap.forEach((x) => {
        if (x.value !== seat.value) {
          document.getElementById(x.value).classList.remove('selected');
        }
      });
      document.getElementById(seat.value).classList.add('selected');
      document.getElementById('seat-number').innerText = `(${selection})`;
      confirmButton.disabled = false;
    };
  });
};

const toggleFormContent = (event) => {
  event.preventDefault();
  const flightNumber = flightInput.value;
  fetch(`/flights/${flightNumber}`)
    .then((res) => res.json())
    .then((data) => {
      data.forEach((element) => {
        let seatId = element.id;
        let isSeatAvailable = element.isAvailable;

        if (!isSeatAvailable) {
          document.getElementById(seatId).className = 'occupied';
          document.getElementById(seatId).onclick = () => {
            return false;
          }
        }
      })
    });

  renderSeats();
};

const handleConfirmSeat = (event) => {
  event.preventDefault();
  let form = document.getElementsByName("salesForm");

  let data = {
    flight: flight.value,
    givenName: givenName.value,
    surname: surname.value,
    email: email.value,
    seat: selection,
  }
  fetch('/reservations', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((responseBody) => {
      const { status, error } = responseBody;
      if (status === 'success') {
        window.location.href = `/seat-select/confirmed.html?email=${email.value}`;
      } else if (error) {
        console.log(error);
      }
    });
};

flightInput.addEventListener('change', toggleFormContent);