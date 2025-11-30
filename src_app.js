// Minimal weather dashboard (uses OpenWeatherMap).
// Behavior:
// - If window.OPENWEATHER_API_KEY is set, requests go directly to the API.
// - If not set, expects a proxy at /api/weather (see server/index.js) that forwards calls.
// Do NOT hardcode keys into client-side code for production.

const API_BASE = '/api'; // proxy root. If using direct mode, client functions will detect and call full URLs.

const elements = {
  cityInput: document.getElementById('city-input'),
  unitsSelect: document.getElementById('units-select'),
  searchBtn: document.getElementById('search-btn'),
  error: document.getElementById('error'),
  current: document.getElementById('current'),
  currentCity: document.getElementById('current-city'),
  currentIcon: document.getElementById('current-icon'),
  currentDetails: document.getElementById('current-details'),
  forecast: document.getElementById('forecast'),
  forecastCards: document.getElementById('forecast-cards'),
};

elements.searchBtn.addEventListener('click', () => {
  const city = elements.cityInput.value.trim();
  if (!city) return showError('Please enter a city name.');
  const units = elements.unitsSelect.value;
  runLookup(city, units);
});

elements.cityInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') elements.searchBtn.click();
});

function showError(msg) {
  elements.error.textContent = msg;
  elements.error.classList.remove('hidden');
}
function clearError() {
  elements.error.textContent = '';
  elements.error.classList.add('hidden');
}

async function runLookup(city, units='metric') {
  clearError();
  showLoading(true);
  try {
    const current = await fetchCurrentWeather(city, units);
    renderCurrent(current, units);
    const forecast = await fetchForecast(city, units);
    renderForecast(forecast, units);
  } catch (err) {
    showError(err.message || 'Unexpected error');
    console.error(err);
  } finally {
    showLoading(false);
  }
}

function showLoading(on) {
  elements.searchBtn.disabled = on;
  elements.searchBtn.textContent = on ? 'Loading...' : 'Search';
}

function getIconUrl(icon) {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}

// If window.OPENWEATHER_API_KEY is present => direct client calls to OpenWeatherMap
const DIRECT_KEY = window.OPENWEATHER_API_KEY && window.OPENWEATHER_API_KEY.length > 0;

async function fetchCurrentWeather(city, units='metric') {
  if (DIRECT_KEY) {
    const key = window.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=${units}&appid=${key}`;
    const resp = await fetch(url);
    if (!resp.ok) throw new Error('Failed to fetch current weather: ' + resp.statusText);
    return await resp.json();
  } else {
    // Proxy mode: POST /api/weather/current { city, units }
    const resp = await fetch(`${API_BASE}/weather/current`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({city, units})
    });
    if (!resp.ok) {
      const txt = await resp.text();
      throw new Error('Proxy error: ' + txt);
    }
    return await resp.json();
  }
}

async function fetchForecast(city, units='metric') {
  if (DIRECT_KEY) {
    const key = window.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=${units}&appid=${key}`;
    const resp = await fetch(url);
    if (!resp.ok) throw new Error('Failed to fetch forecast: ' + resp.statusText);
    return await resp.json();
  } else {
    const resp = await fetch(`${API_BASE}/weather/forecast`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({city, units})
    });
    if (!resp.ok) {
      const txt = await resp.text();
      throw new Error('Proxy error: ' + txt);
    }
    return await resp.json();
  }
}

function renderCurrent(data, units) {
  elements.current.classList.remove('hidden');
  const name = `${data.name}${data.sys && data.sys.country ? ', ' + data.sys.country : ''}`;
  elements.currentCity.textContent = name;

  const icon = data.weather && data.weather[0] ? data.weather[0].icon : null;
  elements.currentIcon.innerHTML = icon ? `<img src="${getIconUrl(icon)}" alt="weather icon">` : '';

  const tempUnit = units === 'imperial' ? '°F' : units === 'standard' ? 'K' : '°C';
  const details = [];
  if (data.main) {
    details.push(`<div class="big">${Math.round(data.main.temp)}${tempUnit}</div>`);
    details.push(`<div>Feels like: ${Math.round(data.main.feels_like)}${tempUnit}</div>`);
    details.push(`<div>Humidity: ${data.main.humidity}%</div>`);
  }
  if (data.weather && data.weather[0]) {
    details.push(`<div>${escapeHtml(data.weather[0].description)}</div>`);
  }
  elements.currentDetails.innerHTML = details.join('');
}

function renderForecast(forecastData, units) {
  elements.forecast.classList.remove('hidden');
  // forecastData.list contains 3-hour entries for 5 days. We'll group by day (local date).
  const groups = {};
  (forecastData.list || []).forEach(item => {
    const dt = new Date(item.dt * 1000);
    const dayKey = dt.toISOString().slice(0,10);
    groups[dayKey] = groups[dayKey] || [];
    groups[dayKey].push(item);
  });
  // Build daily summaries (skip today if desired). Show up to 5 days.
  const days = Object.keys(groups).slice(0,6); // include today
  elements.forecastCards.innerHTML = '';
  days.forEach(key => {
    const items = groups[key];
    if (!items || items.length===0) return;
    // choose midday-ish item as representative
    const rep = items[Math.floor(items.length/2)];
    const dateLabel = (new Date(key)).toLocaleDateString(undefined, {weekday:'short', month:'short', day:'numeric'});
    const icon = rep.weather && rep.weather[0] ? rep.weather[0].icon : '';
    const tempMin = Math.min(...items.map(it => it.main.temp_min));
    const tempMax = Math.max(...items.map(it => it.main.temp_max));
    const tempUnit = units === 'imperial' ? '°F' : units === 'standard' ? 'K' : '°C';
    const card = document.createElement('div');
    card.className = 'forecast-card';
    card.innerHTML = `
      <div><strong>${dateLabel}</strong></div>
      <div><img src="${getIconUrl(icon)}" alt="" width="64" height="64"></div>
      <div>${Math.round(tempMax)}${tempUnit} / ${Math.round(tempMin)}${tempUnit}</div>
      <div style="opacity:0.9">${escapeHtml(rep.weather[0]?.description || '')}</div>
    `;
    elements.forecastCards.appendChild(card);
  });
}

function escapeHtml(s='') {
  return String(s).replace(/[&<>"']/g, function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]});
}