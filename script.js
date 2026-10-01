
// =====================================
// Weather Dashboard
// =====================================

// Get elements from the HTML
const weatherForm = document.getElementById("weather-form");
const cityInput = document.getElementById("city-input");

const weatherSection = document.getElementById("weather-section");
const errorMessage = document.getElementById("error-message");
const loadingMessage = document.getElementById("loading-message");

const locationElement = document.getElementById("location");
const weatherCondition = document.getElementById("weather-condition");
const weatherIcon = document.getElementById("weather-icon");

const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");
const feelsLike = document.getElementById("feels-like");


// =====================================
// Weather Code Conversion
// =====================================

function getWeatherInfo(code) {

    const weatherCodes = {
        0: {
            condition: "Clear sky",
            icon: "☀️"
        },

        1: {
            condition: "Mainly clear",
            icon: "🌤️"
        },

        2: {
            condition: "Partly cloudy",
            icon: "⛅"
        },

        3: {
            condition: "Overcast",
            icon: "☁️"
        },

        45: {
            condition: "Foggy",
            icon: "🌫️"
        },

        48: {
            condition: "Foggy",
            icon: "🌫️"
        },

        51: {
            condition: "Light drizzle",
            icon: "🌦️"
        },

        53: {
            condition: "Moderate drizzle",
            icon: "🌦️"
        },

        55: {
            condition: "Heavy drizzle",
            icon: "🌧️"
        },

        61: {
            condition: "Light rain",
            icon: "🌦️"
        },

        63: {
            condition: "Moderate rain",
            icon: "🌧️"
        },

        65: {
            condition: "Heavy rain",
            icon: "🌧️"
        },

        71: {
            condition: "Light snowfall",
            icon: "🌨️"
        },

        73: {
            condition: "Moderate snowfall",
            icon: "❄️"
        },

        75: {
            condition: "Heavy snowfall",
            icon: "❄️"
        },

        80: {
            condition: "Light rain showers",
            icon: "🌦️"
        },

        81: {
            condition: "Moderate rain showers",
            icon: "🌧️"
        },

        82: {
            condition: "Heavy rain showers",
            icon: "⛈️"
        },

        95: {
            condition: "Thunderstorm",
            icon: "⛈️"
        },

        96: {
            condition: "Thunderstorm with hail",
            icon: "⛈️"
        },

        99: {
            condition: "Thunderstorm with heavy hail",
            icon: "⛈️"
        }
    };

    return weatherCodes[code] || {
        condition: "Unknown weather",
        icon: "🌡️"
    };
}


// =====================================
// Get City Coordinates
// =====================================

async function getCityCoordinates(city) {

    const url =
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Unable to connect to the location service.");
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
        throw new Error("City not found. Please enter a valid city name.");
    }

    return data.results[0];
}


// =====================================
// Get Weather Data
// =====================================

async function getWeather(latitude, longitude) {

    const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Unable to fetch weather information.");
    }

    const data = await response.json();

    return data;
}


// =====================================
// Display Weather
// =====================================

function displayWeather(cityData, weatherData) {

    const currentWeather = weatherData.current;

    const weatherInfo = getWeatherInfo(
        currentWeather.weather_code
    );

    // Location
    locationElement.textContent =
        `${cityData.name}, ${cityData.country}`;

    // Weather condition
    weatherCondition.textContent =
        weatherInfo.condition;

    // Weather icon
    weatherIcon.textContent =
        weatherInfo.icon;

    // Temperature
    temperature.textContent =
        Math.round(currentWeather.temperature_2m);

    // Humidity
    humidity.textContent =
        currentWeather.relative_humidity_2m;

    // Wind speed
    windSpeed.textContent =
        Math.round(currentWeather.wind_speed_10m);

    // Feels like temperature
    feelsLike.textContent =
        Math.round(currentWeather.apparent_temperature);

    // Show weather section
    weatherSection.hidden = false;
}


// =====================================
// Handle Form Submission
// =====================================

weatherForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const city = cityInput.value.trim();

    // Clear previous messages
    errorMessage.hidden = true;
    weatherSection.hidden = true;

    // Check empty input
    if (!city) {

        errorMessage.textContent =
            "Please enter a city name.";

        errorMessage.hidden = false;

        return;
    }

    // Show loading message
    loadingMessage.hidden = false;

    try {

        // Get city coordinates
        const cityData =
            await getCityCoordinates(city);

        // Get weather information
        const weatherData =
            await getWeather(
                cityData.latitude,
                cityData.longitude
            );

        // Display weather
        displayWeather(
            cityData,
            weatherData
        );

    } catch (error) {

        console.error(
            "Weather request failed:",
            error
        );

        errorMessage.textContent =
            error.message ||
            "Something went wrong. Please try again.";

        errorMessage.hidden = false;

    } finally {

        // Hide loading message
        loadingMessage.hidden = true;
    }

});

