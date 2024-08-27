const api =
  "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline";
const key = "DZLMPXYVHYKAX79YY57FNVJJ3";
const include = "current,hours,days";
const elements = [
  "conditions",
  "icon",
  "temp",
  "datetime",
  "precipprob",
  "tempmin",
  "tempmax",
  "feelslike",
];
const opts = `include=${include}&elements=${elements.join(
  ","
)}&contentType=json`;

async function getWeather(city, units) {
  const cityEncoded = encodeURIComponent(city);
  const url = `${api}/${cityEncoded}?key=${key}&unitGroup=${units}&${opts}`;

  console.log(`Fetching API: ${url}`);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      // raw response text for debugging
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      throw new Error(
        `Data couldn't be fetched with status code ${response.status}.`
      );
    }

    const data = await response.json();
    console.log("Full API Response:", JSON.stringify(data, null, 2));

    return data;
  } catch (error) {
    console.error("Error in getWeather:", error);
    throw error;
  }
}
export { getWeather };
