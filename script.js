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

class Workout {
  date = Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
  }).format(new Date());
  id = String(Date.now()).slice(-10);
  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
  }
  _setDescription() {
    return (this.description = `${this.type} on ${this.date}`);
  }
}
class Running extends Workout {
  type = 'Running';
  workoutTypeIcon = '🏃‍♂️';
  wokroutUnitIcon = '🦶🏼';
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription();
  }
  calcPace() {
    this.pace = (this.duration / this.distance).toFixed(1);
    return this.pace;
  }
}
class Cycling extends Workout {
  type = 'Cycling';
  workoutTypeIcon = '🚴‍♀️';
  wokroutUnitIcon = '⛰';
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
    this._setDescription();
  }
  calcSpeed() {
    this.speed = (this.distance / (this.duration / 60)).toFixed(1);
    return this.speed;
  }
}
class App {
  #map;
  #mapEvent;
  #wokrouts = [];
  constructor() {
    this._getPosition();
    form.addEventListener('submit', this._newWorkout.bind(this));
    inputType.addEventListener('change', this._toggelElevationField.bind(this));
    containerWorkouts.addEventListener('click', this._moveMap.bind(this));
  }
  _moveMap(event) {
    const targetElement = event.target.closest('.workout');
    if (targetElement) {
      const id = targetElement.dataset.id;
      const clickedWorkout = this.#wokrouts.find(ele => ele.id === id);
      this.#map.flyTo(clickedWorkout.coords, 13, {
        animate: true,
        duration: 1,
      });
    }
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
  _hideForm() {
    form.classList.add('hidden');
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';
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
  _displayWorkout(workout) {
    const html = `<li class="workout workout--${workout.type.toLowerCase()}" data-id="${
      workout.id
    }">
          <h2 class="workout__title">${workout.description}</h2>
          <div class="workout__details">
            <span class="workout__icon">${workout.workoutTypeIcon}</span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${
              workout.type === 'Running' ? workout.pace : workout.speed
            }</span>
            <span class="workout__unit">${
              workout.type === 'Running' ? 'min/km' : 'km/h'
            }</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">${workout.wokroutUnitIcon}</span>
            <span class="workout__value">${
              workout.type === 'Running'
                ? workout.cadence
                : workout.elevationGain
            }</span>
            <span class="workout__unit">${
              workout.type === 'Running' ? 'spm' : 'm'
            }</span>
          </div>
        </li>`;
    form.insertAdjacentHTML('afterend', html.trim());
  }
  _newWorkout(event) {
    event.preventDefault();
    //Validate data
    const validData = function (distance, duration, unit) {
      const dist = Number.parseFloat(distance);
      const dur = Number.parseFloat(duration);
      const unnt = Number.parseFloat(unit);
      return (
        isFinite(dist) &&
        dist > 0 &&
        isFinite(dur) &&
        dur > 0 &&
        isFinite(unnt) &&
        unnt > 0
      );
    };
    //Get Form Data
    const workoutType = inputType.value;
    const distance = inputDistance.value;
    const duration = inputDuration.value;
    const cadence = inputCadence.value;
    const elevation = inputElevation.value;
    //Validate Form Data
    const unit = cadence ? cadence : elevation;
    if (!validData(distance, duration, unit)) return alert('Invalid Data 🔕');
    const { lat, lng } = this.#mapEvent.latlng;
    const coords = [lat, lng];
    //If the workout is Running 🏃 Create Running Workout
    let workoutObj = null;
    if (workoutType === 'running') {
      workoutObj = new Running(coords, distance, duration, cadence);
    } else if (workoutType === 'cycling') {
      workoutObj = new Cycling(coords, distance, duration, elevation);
    }
    this.#wokrouts.push(workoutObj);
    console.log(this.#wokrouts);
    //display the workout on the list
    this._displayWorkout(workoutObj);

    //render the marker on the map
    this._renderWorkoutMarker(workoutObj);
    //Clear the form inputs
    inputDistance.focus();
    this._hideForm();
  }
  _renderWorkoutMarker(workout) {
    //create the marker at the clicked coords
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type.toLowerCase()}-popup`,
        })
      )
      .setPopupContent(`${workout.description} ${workout.workoutTypeIcon}`)
      .openPopup();
  }
}
const app = new App();
