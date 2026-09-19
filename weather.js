// ===============================
// DOM ELEMENTS
// ===============================

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");

const cityName = document.getElementById("cityName");
const countryName = document.getElementById("countryName");

const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const feelsLike = document.getElementById("feelsLike");

const weatherDescription =
    document.getElementById("weatherDescription");

const weatherIcon =
    document.getElementById("weatherIcon");


// ===============================
// SEARCH BUTTON
// ===============================

searchBtn.addEventListener("click", function () {

    const city = cityInput.value.trim();

    if (city === "") {

        errorMessage.textContent =
            "Please enter a city name.";

        return;
    }

    getWeather(city);

});


// ===============================
// ENTER KEY
// ===============================

cityInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {

        searchBtn.click();

    }

});


// ===============================
// GET WEATHER
// ===============================

async function getWeather(city) {

    try {

        // Clear old error
        errorMessage.textContent = "";

        // Show loading
        loading.style.display = "block";

        // Disable button
        searchBtn.disabled = true;


        // ==========================
        // STEP 1: FIND CITY
        // ==========================

        const locationResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );


        // Check network response
        if (!locationResponse.ok) {

            throw new Error(
                "Unable to connect to location service."
            );

        }


        const locationData =
            await locationResponse.json();


        // Check whether city exists
        if (
            !locationData.results ||
            locationData.results.length === 0
        ) {

            throw new Error(
                "City not found. Please enter a valid city name."
            );

        }


        // Get first matching city
        const location =
            locationData.results[0];


        const latitude = location.latitude;
        const longitude = location.longitude;


        // ==========================
        // STEP 2: GET WEATHER
        // ==========================

        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code&timezone=auto`
        );


        if (!weatherResponse.ok) {

            throw new Error(
                "Unable to fetch weather data."
            );

        }


        const weatherData =
            await weatherResponse.json();


        // ==========================
        // STEP 3: RENDER DATA
        // ==========================

        displayWeather(
            location,
            weatherData
        );


    } catch (error) {

        // ==========================
        // ERROR HANDLING
        // ==========================

        errorMessage.textContent =
            error.message;

        clearWeather();

    } finally {

        // Hide loading
        loading.style.display = "none";

        // Enable button
        searchBtn.disabled = false;

    }

}


// ===============================
// DISPLAY WEATHER
// ===============================

function displayWeather(location, data) {

    const current = data.current;


    // City
    cityName.textContent =
        location.name;


    // Country
    countryName.textContent =
        location.country;


    // Temperature
    temperature.textContent =
        Math.round(current.temperature_2m);


    // Humidity
    humidity.textContent =
        current.relative_humidity_2m + "%";


    // Wind
    windSpeed.textContent =
        current.wind_speed_10m + " km/h";


    // Feels like
    feelsLike.textContent =
        Math.round(current.apparent_temperature) + "°C";


    // Weather description
    const description =
        getWeatherDescription(current.weather_code);

    weatherDescription.textContent =
        description;


    // Weather icon
    weatherIcon.textContent =
        getWeatherIcon(current.weather_code);

}


// ===============================
// WEATHER DESCRIPTION
// ===============================

function getWeatherDescription(code) {

    if (code === 0) {
        return "Clear sky";
    }

    if (code === 1 || code === 2 || code === 3) {
        return "Partly cloudy";
    }

    if (code === 45 || code === 48) {
        return "Foggy";
    }

    if (
        code === 51 ||
        code === 53 ||
        code === 55
    ) {
        return "Drizzle";
    }

    if (
        code === 61 ||
        code === 63 ||
        code === 65
    ) {
        return "Rain";
    }

    if (
        code === 71 ||
        code === 73 ||
        code === 75
    ) {
        return "Snow";
    }

    if (
        code === 80 ||
        code === 81 ||
        code === 82
    ) {
        return "Rain showers";
    }

    if (
        code === 95 ||
        code === 96 ||
        code === 99
    ) {
        return "Thunderstorm";
    }

    return "Unknown weather";

}


// ===============================
// WEATHER ICON
// ===============================

function getWeatherIcon(code) {

    if (code === 0) {
        return "☀️";
    }

    if (code === 1 || code === 2 || code === 3) {
        return "⛅";
    }

    if (code === 45 || code === 48) {
        return "🌫️";
    }

    if (
        code >= 51 &&
        code <= 67
    ) {
        return "🌧️";
    }

    if (
        code >= 71 &&
        code <= 77
    ) {
        return "❄️";
    }

    if (
        code >= 80 &&
        code <= 82
    ) {
        return "🌦️";
    }

    if (
        code >= 95
    ) {
        return "⛈️";
    }

    return "🌤️";

}


// ===============================
// CLEAR WEATHER
// ===============================

function clearWeather() {

    temperature.textContent = "--";

    humidity.textContent = "--%";

    windSpeed.textContent = "-- km/h";

    feelsLike.textContent = "--°C";

    weatherDescription.textContent =
        "Weather information";

    weatherIcon.textContent = "🌤️";

}