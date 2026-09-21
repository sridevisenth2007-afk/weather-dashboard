const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const feelsLike = document.getElementById("feelsLike");
const weatherDescription = document.getElementById("weatherDescription");

const errorMessage = document.getElementById("errorMessage");
const loading = document.getElementById("loading");


// Search button
searchBtn.addEventListener("click", () => {

    const city = cityInput.value.trim();

    if (city === "") {
        showError("Please enter a city name.");
        return;
    }

    getWeather(city);
});


// Press Enter to search
cityInput.addEventListener("keypress", (event) => {

    if (event.key === "Enter") {

        const city = cityInput.value.trim();

        if (city === "") {
            showError("Please enter a city name.");
            return;
        }

        getWeather(city);
    }
});


// Main weather function
async function getWeather(city) {

    try {

        errorMessage.textContent = "";
        loading.style.display = "block";

        /*
         * STEP 1:
         * Find latitude and longitude of the city
         */

        const geoURL =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

        const geoResponse = await fetch(geoURL);

        if (!geoResponse.ok) {
            throw new Error("Unable to find the city.");
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found. Please enter a valid city name.");
        }

        const location = geoData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;

        const displayCity = location.name;

        /*
         * STEP 2:
         * Get weather using latitude and longitude
         */

        const weatherURL =
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code&timezone=auto`;

        const weatherResponse = await fetch(weatherURL);

        if (!weatherResponse.ok) {
            throw new Error("Unable to fetch weather data.");
        }

        const weatherData = await weatherResponse.json();

        /*
         * STEP 3:
         * Get current weather data
         */

        const current = weatherData.current;

        /*
         * STEP 4:
         * Display data
         */

        cityName.textContent = displayCity;

        temperature.textContent =
            Math.round(current.temperature_2m);

        humidity.textContent =
            current.relative_humidity_2m + "%";

        windSpeed.textContent =
            current.wind_speed_10m + " km/h";

        feelsLike.textContent =
            Math.round(current.apparent_temperature) + "°C";

        weatherDescription.textContent =
            getWeatherDescription(current.weather_code);

    }

    catch (error) {

        showError(error.message);

        cityName.textContent = "--";
        temperature.textContent = "--";
        humidity.textContent = "--";
        windSpeed.textContent = "--";
        feelsLike.textContent = "--";
        weatherDescription.textContent = "Weather information";

    }

    finally {

        loading.style.display = "none";

    }
}


// Error function
function showError(message) {

    errorMessage.textContent = message;

}


// Convert weather code into description
function getWeatherDescription(code) {

    if (code === 0) {
        return "Clear Sky ☀️";
    }

    if (code === 1 || code === 2) {
        return "Partly Cloudy ⛅";
    }

    if (code === 3) {
        return "Cloudy ☁️";
    }

    if (code === 45 || code === 48) {
        return "Foggy 🌫️";
    }

    if (
        code === 51 ||
        code === 53 ||
        code === 55
    ) {
        return "Drizzle 🌦️";
    }

    if (
        code === 61 ||
        code === 63 ||
        code === 65
    ) {
        return "Rainy 🌧️";
    }

    if (
        code === 71 ||
        code === 73 ||
        code === 75
    ) {
        return "Snowy ❄️";
    }

    if (
        code === 80 ||
        code === 81 ||
        code === 82
    ) {
        return "Rain Showers 🌧️";
    }

    if (
        code === 95 ||
        code === 96 ||
        code === 99
    ) {
        return "Thunderstorm ⛈️";
    }

    return "Unknown Weather";
}


// Load Chennai weather when page opens
getWeather("Chennai");