// view.js
import { getWeather } from "./weather";
import { fetchUserCity } from "./getlocation";

const main = document.querySelector(".app");

async function init() {
  // Show the loading screen
  document.getElementById("loading-screen").style.display = "flex";

  try {
    const city = await fetchUserCity();
    console.log("User's City:", city);

    const weatherData = await getWeather(city, "us");
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
}
function displayHeader(city) {
  const locationText = document.querySelector(".locationText");
  console.log("city unformatted:" + city);
  const parts = city.split(",").map((part) => part.trim());

  const cityName = parts[0];
  locationText.textContent = cityName;
}
export { init };
