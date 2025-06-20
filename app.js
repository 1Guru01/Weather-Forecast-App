const API_KEY = "25479cb3f6a5ba0b5287a29a7cbc20c3"; 

const elements = {
  bg: document.getElementById("bgAnimation"),
  loading: document.getElementById("loading"),
  weatherInfo: document.getElementById("weatherInfo"),
  errorMessage: document.getElementById("errorMessage"),
  location: document.getElementById("location"),
  date: document.getElementById("date"),
  icon: document.getElementById("weatherIcon"),
  temp: document.getElementById("temperature"),
  desc: document.getElementById("description"),
  feelsLike: document.getElementById("feelsLike"),
  humidity: document.getElementById("humidity"),
  wind: document.getElementById("windSpeed"),
  pressure: document.getElementById("pressure"),
};

function createParticles(count = 15) {
  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    Object.assign(p.style, {
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      width: `${Math.random() * 6 + 4}px`,
      height: p.style.width,
      animationDelay: `${Math.random() * 6}s`,
      animationDuration: `${Math.random() * 4 + 4}s`,
    });
    elements.bg.appendChild(p);
  }
}

const weatherIcons = {
  "clear sky": "☀️",
  "few clouds": "🌤️",
  "scattered clouds": "⛅",
  "broken clouds": "☁️",
  "shower rain": "🌦️",
  rain: "🌧️",
  thunderstorm: "⛈️",
  snow: "🌨️",
  mist: "🌫️",
  haze: "🌫️",
  fog: "🌫️",
};

function getWeatherIcon(description = "") {
  const desc = description.toLowerCase();
  for (const key in weatherIcons) {
    if (desc.includes(key)) return weatherIcons[key];
  }
  return "🌤️";
}

function changeBackground(main) {
  document.body.className = "";
  const theme =
    {
      clear: "sunny",
      clouds: "cloudy",
      rain: "rainy",
      drizzle: "rainy",
      snow: "snowy",
    }[main.toLowerCase()] || "clear";
  document.body.classList.add(theme);
}


const formatDate = () =>
  new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const toggleDisplay = (el, show = true) => {
  el.style.display = show ? "block" : "none";
};

function showLoading() {
  toggleDisplay(elements.loading, true);
  toggleDisplay(elements.weatherInfo, false);
  toggleDisplay(elements.errorMessage, false);
}

function hideLoading() {
  toggleDisplay(elements.loading, false);
}

function showError(msg) {
  hideLoading();
  elements.errorMessage.textContent = msg;
  toggleDisplay(elements.errorMessage, true);
  toggleDisplay(elements.weatherInfo, false);
}

function displayWeather(data) {
  hideLoading();
  toggleDisplay(elements.errorMessage, false);

  const { name, sys, weather, main, wind } = data;

  elements.location.textContent = `${name}, ${sys.country}`;
  elements.date.textContent = formatDate();
  elements.icon.textContent = getWeatherIcon(weather[0].description);
  elements.temp.textContent = `${Math.round(main.temp)}°C`;
  elements.desc.textContent = weather[0].description;
  elements.feelsLike.textContent = `${Math.round(main.feels_like)}°C`;
  elements.humidity.textContent = `${main.humidity}%`;
  elements.wind.textContent = `${Math.round(wind.speed * 3.6)} km/h`;
  elements.pressure.textContent = `${main.pressure} hPa`;

  changeBackground(weather[0].main);
  toggleDisplay(elements.weatherInfo, true);
}

async function fetchWeather(city) {
  showLoading();

  if (!API_KEY || API_KEY === "YOUR_API_KEY_HERE") {
    await simulateDemoWeather(city);
    return;
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    const res = await fetch(url);

    if (!res.ok) throw new Error("City not found");

    const data = await res.json();
    displayWeather(data);
  } catch (err) {
    showError("City not found. Please check the spelling and try again.");
  }
}

async function simulateDemoWeather(city) {
  await new Promise((res) => setTimeout(res, 1000)); // Simulate network delay

  const mockData = {
    london: {
      name: "London",
      sys: { country: "GB" },
      weather: [{ main: "Clouds", description: "broken clouds" }],
      main: { temp: 15, feels_like: 13, humidity: 78, pressure: 1012 },
      wind: { speed: 3.5 },
    },
    "new york": {
      name: "New York",
      sys: { country: "US" },
      weather: [{ main: "Clear", description: "clear sky" }],
      main: { temp: 22, feels_like: 24, humidity: 45, pressure: 1018 },
      wind: { speed: 2.1 },
    },
  };

  const key = city.toLowerCase();
  if (mockData[key]) {
    displayWeather(mockData[key]);
  } else {
    const fallbackData = {
      name: city,
      sys: { country: "XX" },
      weather: [
        {
          main: "Clouds",
          description: "partly cloudy",
        },
      ],
      main: {
        temp: 20,
        feels_like: 18,
        humidity: 70,
        pressure: 1010,
      },
      wind: { speed: 2.5 },
    };
    displayWeather(fallbackData);
  }
}

function searchWeather() {
  const input = document.getElementById("cityInput");
  const city = input.value.trim();
  city ? fetchWeather(city) : showError("Please enter a city name.");
}

document.getElementById("searchBtn").addEventListener("click", searchWeather);
document.getElementById("cityInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchWeather();
});

document.body.classList.add("default-bg");
createParticles();
fetchWeather("London");

