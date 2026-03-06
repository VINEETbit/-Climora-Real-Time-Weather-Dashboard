// ================= COMMON CITIES =================

const commonCities = {
  Paris: { lat: 48.8566, lon: 2.3522 },
  Delhi: { lat: 28.6139, lon: 77.2090 },
  Rome: { lat: 41.9028, lon: 12.4964 },
  Spiti: { lat: 32.2461, lon: 78.0348 },
  Madrid: { lat: 40.4168, lon: -3.7038 },
  Tawang: { lat: 27.5866, lon: 91.8696 }
};

// ================= WEATHER ICON =================

function updateWeatherIcon(temp) {

  let icon = "🌤";

  if (temp >= 35) icon = "🥵☀️";
  else if (temp >= 25) icon = "🌤";
  else if (temp >= 15) icon = "⛅";
  else if (temp >= 5) icon = "🌥";
  else icon = "❄️";

  let iconElement = document.getElementById("weather-icon");

  if (iconElement) {
    iconElement.innerText = icon;
  }

}

// ================= LOAD COMMON CITIES =================

async function loadCommonCities() {

  const tableBody = document.getElementById("weatherTableBody");

  tableBody.innerHTML = `
  <tr>
  <td colspan="6">Loading weather data...</td>
  </tr>
  `;

  try {

    let rows = "";

    for (let city in commonCities) {

      const { lat, lon } = commonCities[city];

      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min&hourly=relativehumidity_2m&timezone=auto`
      );

      const data = await res.json();

      const temp = data.current_weather?.temperature ?? "--";
      const wind = data.current_weather?.windspeed ?? "--";
      const humidity = data.hourly?.relativehumidity_2m?.[0] ?? "--";
      const max = data.daily?.temperature_2m_max?.[0] ?? "--";
      const min = data.daily?.temperature_2m_min?.[0] ?? "--";

      rows += `
      <tr>
        <td>${city}</td>
        <td>${temp} °C</td>
        <td>${humidity} %</td>
        <td>${max} °C</td>
        <td>${min} °C</td>
        <td>${wind} km/h</td>
      </tr>
      `;

    }

    tableBody.innerHTML = rows;

  } catch (error) {

    console.error("Table error:", error);

    tableBody.innerHTML = `
    <tr>
    <td colspan="6">Unable to load weather data</td>
    </tr>
    `;

  }

}

// ================= GET WEATHER =================

async function getWeatherByCity(cityName) {

  try {

    document.getElementById("search-temp").innerText = "Loading...";
    document.getElementById("search-max").innerText = "Loading...";
    document.getElementById("search-min").innerText = "Loading...";
    document.getElementById("search-humidity").innerText = "Loading...";
    document.getElementById("search-wind").innerText = "Loading...";

    // ===== GEO API =====

    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1`
    );

    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {

      alert("City not found");
      resetHome();
      return;

    }

    const { latitude, longitude, name } = geoData.results[0];

    // ===== WEATHER API =====

    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min&hourly=relativehumidity_2m&timezone=auto`
    );

    const weatherData = await weatherRes.json();

    const temp = weatherData.current_weather?.temperature ?? "--";
    const wind = weatherData.current_weather?.windspeed ?? "--";
    const humidity = weatherData.hourly?.relativehumidity_2m?.[0] ?? "--";
    const max = weatherData.daily?.temperature_2m_max?.[0] ?? "--";
    const min = weatherData.daily?.temperature_2m_min?.[0] ?? "--";

    document.getElementById("search-temp").innerText = temp + " °C";
    document.getElementById("search-max").innerText = max + " °C";
    document.getElementById("search-min").innerText = min + " °C";
    document.getElementById("search-humidity").innerText = humidity + " %";
    document.getElementById("search-wind").innerText = wind + " km/h";

    document.getElementById("weather-title").innerText =
      "Weather of " + name;

    updateWeatherIcon(temp);

  } catch (error) {

    console.error("Weather fetch error:", error);

    alert("Unable to fetch weather right now. Try again.");

    resetHome();

  }

}

// ================= SEARCH FORM =================

function searchWeather(event) {

  event.preventDefault();

  const city = document.getElementById("cityInput").value.trim();

  if (!city) return;

  getWeatherByCity(city);

  document.getElementById("cityInput").value = "";

}

// ================= NAVBAR QUICK CITY =================

function searchByCity(cityName) {

  getWeatherByCity(cityName);

}

// ================= RESET HOME =================

function resetHome() {

  document.getElementById("weather-title").innerText =
    "Weather of All Cities";

  document.getElementById("search-temp").innerText = "--";
  document.getElementById("search-max").innerText = "--";
  document.getElementById("search-min").innerText = "--";
  document.getElementById("search-humidity").innerText = "--";
  document.getElementById("search-wind").innerText = "--";

  document.getElementById("aboutContent").style.display = "none";

}

// ================= TOGGLE ABOUT =================

function toggleAbout() {

  const about = document.getElementById("aboutContent");

  if (about.style.display === "none" || about.style.display === "") {

    about.style.display = "block";

    window.scrollTo({
      top: about.offsetTop - 80,
      behavior: "smooth"
    });

  } else {

    about.style.display = "none";

  }

}

// ================= DOM LOADED =================

document.addEventListener("DOMContentLoaded", () => {

  loadCommonCities();

  document.getElementById("aboutContent").style.display = "none";

  document.querySelectorAll(".nav-link").forEach(link => {

    link.addEventListener("click", () => {

      const navbar = document.querySelector(".navbar-collapse");

      if (navbar.classList.contains("show")) {
        new bootstrap.Collapse(navbar).toggle();
      }

    });

  });

});