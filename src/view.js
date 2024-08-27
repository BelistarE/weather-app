// view.js
import { getWeather } from "./weather";
import { fetchUserCity } from "./getlocation";
import { toggle } from "./convert-units";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
Chart.register(ChartDataLabels);
import "./weather-icons.min.css";

//toggle units
let units = toggle();
const main = document.querySelector(".app");
//icon mapping
function getWeatherIcon(condition) {
  console.log("getweatherIcon:" + condition);
  switch (condition.toLowerCase()) {
    case "clear":
      return "wi-day-sunny";
    case "clear-day":
      return "wi-day-sunny";
    case "partly-cloudy-day":
      return "wi-day-cloudy";
    case "cloudy":
      return "wi-cloudy";
    case "rain":
      return "wi-rain";
    case "snow":
      return "wi-snow";
    case "clear-night":
      return "wi-night-clear";
    case "partly-cloudy-night":
      return "wi-night-alt-cloudy";
    case "showers-night":
      return "wi-night-alt-showers";
    case "showers-day":
      return "wi-showers";
    case "thunder-showers-night":
      return "wi-night-alt-storm-showers";
    default:
      return "wi-na"; // Default icon for unknown conditions
  }
}

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
    document.querySelector(".app").style.display = "flex";
    //display stuff
    render(city, weatherData);
  } catch (error) {
    console.error("Error during initialization:", error);
  }
}

function render(city, weatherData) {
  displayHeader(city);
  displayCurrent(weatherData);
  display7DayForecast(weatherData);
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
  const currentPrecipProb = weatherData.currentConditions.precipprob;
  const currentConditions = weatherData.currentConditions.conditions;
  const feelslike = weatherData.currentConditions.feelslike;
  const currentIcon = weatherData.currentConditions.icon;
  const minTemp = weatherData.days[0].tempmin;
  const maxTemp = weatherData.days[0].tempmax;

  let displayTemp = document.querySelector(".current-temp");
  const degreeSign = "°";
  let currentUnits = "";
  if (units === "us") {
    currentUnits = "F";
  } else {
    currentUnits = "C";
  }
  const roundedTemp = Math.round(currentTemp);
  displayTemp.innerHTML = `${roundedTemp}${degreeSign} ${currentUnits}`;
  displayNext12(weatherData, currentTime);

  //time
  const time = document.querySelector(".time");
  let [hours, minutes, seconds] = currentTime.split(":");
  let period = "AM";

  hours = parseInt(hours, 10);
  if (hours >= 12) {
    period = "PM";
    hours = hours > 12 ? hours - 12 : hours;
  }
  if (hours === 0) {
    hours = 12;
  }
  time.innerHTML = `${hours}:${minutes} ${period}`;

  //conditions
  const cast = document.querySelector(".cast");
  cast.innerHTML = currentConditions;
  //precipirationprob
  const precipirationprobselector = document.querySelector(".precip-prop");
  precipirationprobselector.innerHTML = ` ${currentPrecipProb} `;
  //icon
  const iconClass = getWeatherIcon(currentIcon);

  const iconElement = document.querySelector(".weather-icon");
  iconElement.className = `wi ${iconClass}`;

  //feelslike
  const feelslikeselector = document.querySelector(".feelslike");
  const roundedFeels = Math.round(feelslike);
  const rminTemp = Math.round(minTemp);
  const rmaxTemp = Math.round(maxTemp);
  feelslikeselector.innerHTML = `${rminTemp}° / ${rmaxTemp}° Feels like ${roundedFeels}°`;
}

function displayNext12(weatherData, currentTime) {
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

    const todayRemainingHours = todayHours.slice(nextHourIndex);

    hoursData = hoursData.concat(todayRemainingHours);

    if (hoursData.length < 12 && weatherData.days.length > 1) {
      const tomorrowHours = weatherData.days[1].hours;
      const hoursNeeded = 12 - hoursData.length;

      const tomorrowHoursSlice = tomorrowHours.slice(0, hoursNeeded);
      hoursData = hoursData.concat(tomorrowHoursSlice);
    }

    console.log("Next 12 hours data:", hoursData);

    // Prepare data for the chart

    const labels = hoursData.map((hour) => {
      const date = new Date(`1970-01-01T${hour.datetime}`);
      const hours = date.getHours();
      const formattedHour = hours % 12 || 12;
      const ampm = hours >= 12 ? " PM" : " AM";
      return `${formattedHour}${ampm}`;
    });

    const temperatures = hoursData.map((hour) => Math.round(hour.temp));

    const minTemp = Math.min(...temperatures) - 10;
    const maxTemp = Math.max(...temperatures) + 10;
    // Create the chart
    const ctx = document.getElementById("graph").getContext("2d");
    const myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Temperature",
            data: temperatures,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
            fill: true,
            pointRadius: 0,
            tension: 0.1,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: false, // Hide the legend
          },
          datalabels: {
            align: "top", // Position the labels above the points
            anchor: "end",
            formatter: function (value, context) {
              return value + "°"; // Format the label text
            },
            font: {
              weight: "bold",
            },
            color: "white",
          },
        },
        scales: {
          y: {
            beginAtZero: false,
            min: minTemp,
            max: maxTemp,
            title: {
              display: false, // Hide the y-axis label
            },
            ticks: {
              display: false, // Hide the y-axis ticks
            },
            grid: {
              display: false, // Optional: Hide y-axis grid lines
            },
          },
        },
      },
    });
  } else {
    console.error("Hourly data not found in the API response.");
  }
}
function getDayOfWeek(dateString) {
  const date = new Date(dateString + "T00:00:00"); // Force the time to midnight to avoid time zone issues
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return daysOfWeek[date.getDay()];
}

function display7DayForecast(weatherData) {
  const dayElements = document.querySelectorAll(".following-days .day");
  const today = new Date();

  // Filter and exclude today; include tomorrow through the 7th day
  const filteredDays = weatherData.days.filter((day) => {
    const forecastDate = new Date(day.datetime + "T00:00:00"); // Force the time to midnight
    return forecastDate > today && forecastDate <= addDays(today, 7);
  });

  // Ensure we only take 7 days starting from tomorrow
  const daysToShow = filteredDays.slice(0, 7);

  // Display the forecast for the filtered days
  daysToShow.forEach((dayData, index) => {
    const dayElement = dayElements[index];
    const dayIcon = getWeatherIcon(dayData.icon);
    const dayOfWeek = getDayOfWeek(dayData.datetime);
    const rmax = Math.round(dayData.tempmax);
    const rmin = Math.round(dayData.tempmin);
    dayElement.innerHTML = `
      <h3>${dayOfWeek}</h3>
      <div class="right-day">
        <i class="daily-weather-icon wi ${dayIcon}"></i>
        <p>High: ${rmax}°F</p>
        <p>Low: ${rmin}°F</p>
      </div>
    `;
  });
}

// Helper function to add days to a date
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export { init };
