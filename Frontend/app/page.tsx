'use client';
import { useState, FormEvent, ChangeEvent } from "react";

interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  weather: string;
}

interface ForecastData {
  date: string;
  temperature: number;
  weather: string;
}

export default function Home() {
  const [cityName, setCityName] = useState<string>("");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setWeatherData(null);
    setForecastData([]);

    try {
      const response = await fetch(`https://weather-man-web-widget.vercel.app/weather?city=${cityName}`);
      const data = await response.json();

      if (response.ok) {
        setWeatherData(data.weather);
        setForecastData(data.forecast);
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError("Failed to fetch weather data");
    }
  };

  const getVideoSource = (weather: string) => {
    console.log(weather);
    switch (weather.toLowerCase()) {
      case weather.includes('sky') && weather:
        return '/videos/clear.mp4';
      case weather.includes('cloud') && weather:
        return '/videos/fewClouds.mp4';
      case weather.includes('rain') && weather:
        return '/videos/rain.mp4';
      case weather.includes('snow') && weather:
        return '/videos/snow.mp4';
      case 'haze':
        return '/videos/clouds.mp4';
      default:
        return '/videos/default.mp4';
    }
  };

  return (
    <div className="relative min-h-screen">
      <video
        autoPlay
        loop
        muted
        className="absolute inset-0 w-full h-full object-cover filter blur-sm"
        src={weatherData ? getVideoSource(weatherData.weather) : '/videos/default.mp4'}
      />
      <div className="relative z-10 grid grid-rows-[20px_1fr_20px] items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 row-start-2 items-center justify-center">
          <h1 className="text-4xl font-bold text-center sm:text-left bg-white bg-opacity-50 p-4 rounded" style={{ color: 'black' }}>
            Weather Man
          </h1>
          <form onSubmit={fetchWeather} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="City Name"
              value={cityName}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setCityName(e.target.value)}
              className="border p-2 rounded text-black"
              required
            />
            <button
              type="submit"
              className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            >
              Get Weather
            </button>
          </form>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          {weatherData && (
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative text-center">
              <h2 className="text-2xl font-bold mb-2">{weatherData.city}, {weatherData.country}</h2>
              <p className="text-lg">Temperature: <span className="font-semibold">{weatherData.temperature.toFixed(2)}°C</span></p>
              <p className="text-lg">Weather: <span className="font-semibold">{weatherData.weather}</span></p>
            </div>
          )}
          {forecastData.length > 0 && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative text-center mt-4">
              <h2 className="text-2xl font-bold mb-2">5-Day Forecast</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {forecastData.map((forecast, index) => (
                  <div key={index} className="bg-white p-4 rounded shadow">
                    <p className="font-semibold">{new Date(forecast.date).toLocaleDateString()}</p>
                    <p>Temp: {forecast.temperature.toFixed(2)}°C</p>
                    <p>Weather: {forecast.weather}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
        <footer className="row-start-3 text-center text-sm text-gray-500">
          <p>
            Powered by{" "}
            <a
              href="https://openweathermap.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              OpenWeatherMap
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
