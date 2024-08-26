// view.js
import { getWeather } from "./weather";
import { fetchUserCity } from "./getlocation";
let units = "us";
const main = document.querySelector(".app");

async function init() {
  // Show the loading screen
  document.getElementById("loading-screen").style.display = "flex";

  try {
    const city = await fetchUserCity();
    console.log("User's City:", city);

    const weatherData = await getWeather(city, units);
    console.log("Weather Data:", weatherData);

    // Hide the loading screen
    document.getElementById("loading-screen").style.display = "none";
    document.querySelector(".app").style.display = "block";
    //display stuff
    render(city, weatherData);
  } catch (error) {
    console.error("Error during initialization:", error);
  }
}

function render(city, weatherData) {
  displayHeader(city);
  displayCurrent(weatherData);
}
function displayHeader(city) {
  const locationText = document.querySelector(".locationText");
  console.log("city unformatted:" + city);
  const parts = city.split(",").map((part) => part.trim());

  const cityName = parts[0];
  locationText.textContent = cityName;
}
function displayCurrent(weatherData) {
  const currentTemp = weatherData.currentConditions.temp;
  const currentTime = weatherData.currentConditions.datetime;
  const currentIcon = weatherData.currentConditions.icon;
  const currentPrecipProb = weatherData.currentConditions.precipprob;

  console.log("Current Temp:", currentTemp);
  console.log("Current Time:", currentTime);
  console.log("Current Icon:", currentIcon);
  console.log("Precipitation Probability:", currentPrecipProb);

  displayNext12(weatherData);
}

function displayNext12(weatherData) {
  if (weatherData.days && weatherData.days.length > 0) {
    let hoursData = [];

    // Get the current hour
    const currentHour = parseInt(currentTime.split(":")[0], 10);
    console.log("Current Hour:", currentHour);

    // Find the index of the next hour in the current day's hoursData
    const todayHours = weatherData.days[0].hours;
    const nextHourIndex = todayHours.findIndex(
      (hour) => parseInt(hour.datetime.split(":")[0], 10) > currentHour
    );

    //get the remaining hours of today
    const todayRemainingHours = todayHours.slice(nextHourIndex);

    // add these hours to hoursData
    hoursData = hoursData.concat(todayRemainingHours);

    // If we need more hours to reach 12, get them from the next day's hoursData
    if (hoursData.length < 12 && weatherData.days.length > 1) {
      const tomorrowHours = weatherData.days[1].hours;
      const hoursNeeded = 12 - hoursData.length;

      // Slice the next day's hours to get the needed hours
      const tomorrowHoursSlice = tomorrowHours.slice(0, hoursNeeded);
      hoursData = hoursData.concat(tomorrowHoursSlice);
    }

    console.log("Next 12 hours data:", hoursData);
  } else {
    console.error("Hourly data not found in the API response.");
  }
}

export { init };
