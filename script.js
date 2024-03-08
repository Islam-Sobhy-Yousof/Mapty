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

    map.on('click', function (event) {
      const { lat, lng } = event.latlng;
      const coords = [lat, lng];
      L.marker(coords)
        .addTo(map)
        .bindPopup(
          L.popup({
            maxWidth: 250,
            minWidth: 100,
            autoClose: false,
            closeOnClick: false,
            className: 'running-popup',
          })
        ).setPopupContent('Workou 🏃')
        .openPopup();
    });
  },
  function () {
    alert('CAN NOT GET THE CURRENT LOCATION! 🖐️');
  }
);
