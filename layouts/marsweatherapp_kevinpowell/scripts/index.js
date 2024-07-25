// const API_KEY = "caiqUsspANsX2EewTf6K0I7ULfiT5TbsTQojFQxG";
// const API_KEY = "DEMO_KEY";
// const API_URL = `https://api.nasa.gov/insight_weather/?api_key=${API_KEY}&feedtype=json&ver=1.0`;
const API_URL = `http://localhost:5600/mars`;

const previousWeatherBtn = document.querySelector(".show-previous-weather-btn");
const previousWeather = document.querySelector(".previous-weather");
const currentSolElement = document.querySelector("[data-current-sol]");
const currentDateElement = document.querySelector("[data-current-date]");
const currentTempHighElement = document.querySelector(
  "[data-current-temp-high]"
);
const currentTempLowElement = document.querySelector("[data-current-temp-low]");
const windSpeedElement = document.querySelector("[data-wind-speed]");
const windDirectionTextElement = document.querySelector(
  "[data-wind-direction-text]"
);
const windDirectionArrowElement = document.querySelector(
  "[data-wind-direction-arrow]"
);

// **********************
// PREVIOUS DAYS
const previousSolTemplate = document.querySelector(
  "[data-previous-sol-template]"
);
const previousSolContainer = document.querySelector("[data-previous-sols]");

previousWeatherBtn.addEventListener("click", function () {
  previousWeather.classList.toggle("show-weather");
});

// **********************
// ºC to º F
const unitToggle = document.querySelector("[data-unit-toggle]");
const metricRadio = document.querySelector("#cel");
const imperialRadio = document.querySelector("#fah");

async function getWeather() {
  const res = await fetch(API_URL);
  const data = await res.json();
  const { sol_keys, validity_checks, ...solData } = data;
  return Object.entries(solData).map(([sol, info]) => {
    return {
      sol,
      maxTemp: info.AT.mx,
      minTemp: info.AT.mn,
      windSpeed: info.HWS.av,
      windDirectionDegrees: info.WD.most_common.compass_degrees,
      windDirectionCardinal: info.WD.most_common.compass_point,
      date: new Date(info.First_UTC),
    };
  });
}

let selectedSolIndex;
getWeather().then((sols) => {
  selectedSolIndex = sols.length - 1;
  displaySelectedSol(sols);
  displayPreviousSols(sols);
  updateIUnits();

  unitToggle.addEventListener("click", () => {
    let metricUnits = !isMetric();
    metricRadio.checked = metricUnits;
    imperialRadio.checked = !metricUnits;
    displaySelectedSol(sols);
    displayPreviousSols(sols);
    updateIUnits();
  });

  metricRadio.addEventListener("change", () => {
    updateIUnits();
    displaySelectedSol(sols);
    displayPreviousSols(sols);
  });
  imperialRadio.addEventListener("change", () => {
    updateIUnits();
    displaySelectedSol(sols);
    displayPreviousSols(sols);
  });
});

function displayDate(date) {
  return date.toLocaleDateString(undefined, { day: "numeric", month: "long" });
}
function displayTemperature(temperature) {
  let returnTemp = temperature;

  if (!isMetric()) {
    returnTemp = (temperature - 32) * (5 / 9);
  }

  return Math.round(returnTemp);
}
function displaySpeed(speed) {
  let returnSpeed = speed;

  if (!isMetric()) {
    returnSpeed = speed / 1.609;
  }
  return Math.round(returnSpeed);
}

function displaySelectedSol(sols) {
  const selectedSol = sols[selectedSolIndex];
  currentSolElement.innerText = selectedSol.sol;
  currentDateElement.innerText = displayDate(selectedSol.date);
  currentTempHighElement.innerText = displayTemperature(selectedSol.maxTemp);
  currentTempLowElement.innerText = displayTemperature(selectedSol.minTemp);
  windSpeedElement.innerText = displaySpeed(selectedSol.windSpeed);
  windDirectionTextElement.innerText = selectedSol.windDirectionCardinal;
  windDirectionArrowElement.style.setProperty(
    "--direction",
    `${selectedSol.windDirectionDegrees}deg`
  );
}

function displayPreviousSols(sols) {
  previousSolContainer.innerHTML = "";

  sols.forEach((solData, index) => {
    const solContainer = previousSolTemplate.content.cloneNode(true);
    solContainer.querySelector("[data-sol]").innerText = solData.sol;
    solContainer.querySelector("[data-date]").innerText = displayDate(
      solData.date
    );
    solContainer.querySelector("[data-temp-high]").innerText =
      displayTemperature(solData.maxTemp);
    solContainer.querySelector("[data-temp-low]").innerText =
      displayTemperature(solData.minTemp);

    solContainer
      .querySelector("[data-select-button]")
      .addEventListener("click", () => {
        selectedSolIndex = index;
        displaySelectedSol(sols);
      });

    previousSolContainer.appendChild(solContainer);
  });
}

function updateIUnits() {
  const speedUnits = document.querySelectorAll("[data-speed-unit]");
  const tempUnits = document.querySelectorAll("[data-temp-unit]");

  speedUnits.forEach((unit) => (unit.innerText = isMetric() ? "kph" : "mph"));
  tempUnits.forEach((unit) => (unit.innerText = isMetric() ? "C" : "F"));
}

function isMetric() {
  return metricRadio.checked;
}
