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
class App {
  #map;
  #mapEvent;
  constructor() {
    this._getPosition();
    form.addEventListener('submit', this._newWorkout.bind(this));
    inputType.addEventListener('change', this._toggelElevationField.bind(this));
  }
  _getPosition() {
    navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), () =>
      alert('CAN NOT GET THE CURRENT LOCATION!🚫⛰️')
    );
  }
  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    const coords = [latitude, longitude];
    this.#map = L.map('map').setView(coords, 13);
    L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution: 'Free Palestine 🇵🇸 ',
    }).addTo(this.#map);
    this.#map.on('click', this._showForm.bind(this));
  }
  _showForm(event) {
    this.#mapEvent = event;
    form.classList.remove('hidden');
    inputDistance.focus();
  }
  _toggelElevationField() {
    inputElevation.parentElement.classList.toggle('form__row--hidden');
    inputCadence.parentElement.classList.toggle('form__row--hidden');
  }
  _newWorkout(event) {
    event.preventDefault();
    const { lat, lng } = this.#mapEvent.latlng;
    L.marker([lat, lng])
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `running-popup`,
        })
      )
      .setPopupContent('Running' + '🏃')
      .openPopup();
  }
}
const app = new App();


