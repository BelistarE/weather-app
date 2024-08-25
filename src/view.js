// view.js
import { getWeather } from "./weather";
import { fetchUserCity } from "./getlocation";

async function init() {
  // Show the loading screen
  document.getElementById("loading-screen").style.display = "flex";

  try {
    const city = await fetchUserCity();
    console.log("User's City:", city);

    const weatherData = await getWeather(city, "us");
    console.log("Weather Data:", weatherData);

    // Hide the loading screen and show the main content
    document.getElementById("loading-screen").style.display = "none";
    document.querySelector(".app").style.display = "block";

    // Handle the display of weather data or other content here
  } catch (error) {
    console.error("Error during initialization:", error);
  }
}

export { init };
