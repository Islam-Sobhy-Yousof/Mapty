'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

/*
-Getting the current postion
*/
navigator.geolocation.getCurrentPosition(
  function (position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    const currentMap = `https://www.google.com/maps/@=${latitude},${longitude}`;
    console.log(currentMap);
    const coords = [latitude, longitude];
    const map = L.map('map').setView(coords, 13);
    L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution: 'Free Palestine 🇵🇸 ',
    }).addTo(map);
    /*
        - Adding a marker at whre we click 
        - we can't add an event on the map container instead we will add it on the map variable
        - we don't use the addEvenentListener instead use the on method which leaflet provide us with
    */

    /*
        -what this function should do ?
        - at first when clikc on the map the form is displayed
        - after this when the user inputs the data correctly 
        - the marker and the popup will be displayed 
          - validations of the form is like this 
            - you should change the place holder of the [Distance,Elev Gain] 
            according to the dropDown menue
            - you should make sure that the fields [Distance,Duration] is positive
          -if the form is valid you should take the data from the form and depending on the DD
            -if it was running display the running view
            -if it was cycling display the cycling view
            -display the marker with popup has [type, on + month + day]
    */
    let clickedCoords = [0, 0];
    map.on('click', function (event) {
      const { lat, lng } = event.latlng;
      clickedCoords = [lat, lng];
      //there is something here
      //1. displaying the form
      form.classList.remove('hidden');

      //2.
    });

    //Form related stuff
    //clear form inputs
    const clearForm = function () {
      inputDistance.value = '';
      inputDuration.value = '';
      inputCadence.value = '';
      inputElevation.value = '';
    };
    //create form element
    const createFormElement = function (workoutType, dist, duration, rate) {
      const elementView = `<li class="workout workout--running" data-id="1234567890">
          <h2 class="workout__title">${workoutType}</h2>
          <div class="workout__details">
            <span class="workout__icon">🏃‍♂️</span>
            <span class="workout__value">${dist}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${duration}</span>
            <span class="workout__unit">min</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${((60 * dist) / duration).toFixed(
              2
            )}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${rate || 1}</span>
            <span class="workout__unit">spm</span>
          </div>
        </li>`;
      containerWorkouts.insertAdjacentHTML('beforeend', elementView.trim());
    };
    inputType.addEventListener('change', function () {
      //you have to change the display of various fields
      inputElevation.parentElement.classList.toggle('form__row--hidden');
      inputCadence.parentElement.classList.toggle('form__row--hidden');
    });
    form.addEventListener('click', function (event) {
      event.preventDefault();
      //Form validation
      const validField = input => {
        return (
          Number.isFinite(Number.parseFloat(input.value)) &&
          Number.parseFloat(input.value) > 0
        );
      };
      const rate =
        inputType.value === 'running'
          ? validField(inputCadence)
          : validField(inputElevation);
      if (validField(inputDistance) && validField(inputDuration) && rate) {
        //Validation action
        const dropdwonValue = inputType.value;
        dropdwonValue.replace(dropdwonValue[0], dropdwonValue[0].toUpperCase());
        const now = new Date();
        const currentDate = Intl.DateTimeFormat('en-US', {
          month: 'long',
          day: 'numeric',
        }).format(now);
        const workoutType = `${dropdwonValue} on ${currentDate}`;
        //displaying the running view
        createFormElement(
          workoutType,
          inputDistance.value,
          inputDuration.value,
          inputCadence.value
        );
        clearForm();
        //make the form hidden again
        form.classList.add('hidden');
        L.marker(clickedCoords)
          .addTo(map)
          .bindPopup(
            L.popup({
              maxWidth: 250,
              minWidth: 100,
              autoClose: false,
              closeOnClick: false,
              className: `${dropdwonValue}-popup`,
            })
          )
          .setPopupContent(workoutType + '🏃')
          .openPopup();
      }
    });
  },
  function () {
    alert('CAN NOT GET THE CURRENT LOCATION! 🖐️');
  }
);
