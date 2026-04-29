import React, { useState } from "react";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = async (cityName) => {
    if (!cityName) return;
    setLoading(true);
    setError(null);
    setWeather(null);

    try {
      const q = encodeURIComponent(cityName.trim());
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${q}&appid=${API_KEY}&units=metric`;

      const res = await fetch(url);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to fetch weather");
      }
      const data = await res.json();

      const shaped = {
        city: data.name,
        country: data.sys?.country,
        temp: data.main?.temp,
        feels_like: data.main?.feels_like,
        humidity: data.main?.humidity,
        description: data.weather && data.weather[0]?.description,
        icon: data.weather && data.weather[0]?.icon,
      };

      setWeather(shaped);
    } catch (err) {
      setError(err.message || "Error fetching weather");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeather(city);
  };

  return (
    <div className="container">
      <h1>Weather App</h1>

      <form onSubmit={handleSubmit} className="form">
        <input
          className="input"
          type="text"
          placeholder="Enter city e.g. Mumbai"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          aria-label="city-input"
        />
        <button className="button" type="submit">Get Weather</button>
      </form>

      {loading && <p className="muted">Loading...</p>}
      {error && <p className="error">Error: {error}</p>}

      {weather && (
        <div className="card">
          <h2>
            {weather.city}{weather.country ? `, ${weather.country}` : ""}
          </h2>

          <div className="row">
            {weather.icon && (
              <img
                alt={weather.description}
                src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                width="80"
                height="80"
              />
            )}
            <div className="col">
              <p className="temp">{Math.round(weather.temp)}°C</p>
              <p className="muted">Feels like: {Math.round(weather.feels_like)}°C</p>
              <p style={{ textTransform: "capitalize" }}>{weather.description}</p>
              <p className="muted">Humidity: {weather.humidity}%</p>
            </div>
          </div>
        </div>
      )}

      
    </div>
  );
}
