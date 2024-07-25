const API_KEY = "DEMO_KEY";
const API_URL = `https://api.nasa.gov/insight_weather/?api_key=${API_KEY}&feedtype=json&ver=1.0`;

const previousWeatherBtn = document.querySelector(".show-previous-weather-btn");
const previousWeather = document.querySelector(".previous-weather");

previousWeatherBtn.addEventListener("click", function () {
  previousWeather.classList.toggle("show-weather");
});

function getWeather() {
  fetch(API_URL).then((res) => res.json());
}
