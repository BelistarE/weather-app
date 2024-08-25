function getCoordinates() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ latitude, longitude });
        },
        (error) => {
          reject(error);
        }
      );
    } else {
      reject(new Error("Geolocation is not supported by this browser."));
    }
  });
}

// OpenCage API
async function getCityFromCoordinates(latitude, longitude) {
  const apiKey = "078d9c9cd66048dca03fc55b97da0828";
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch location data.");

    const data = await response.json();
    const components = data.results[0].components;
    const city = components.city || components.town || components.village;
    const state = components.state;
    const country = components.country;

    // Return city, state, and country in a format suitable for VisualCrossing
    return `${city}, ${state}, ${country}`;
  } catch (error) {
    console.error("Error in reverse geocoding:", error);
  }
}

async function fetchUserCity() {
  try {
    const { latitude, longitude } = await getCoordinates();
    console.log("User's Coordinates:", latitude, longitude);

    const location = await getCityFromCoordinates(latitude, longitude);
    return location;
  } catch (error) {
    console.error("Error fetching user's city:", error);
  }
}

export { fetchUserCity };
