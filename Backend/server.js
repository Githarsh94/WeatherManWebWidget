import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();


const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.get('/', (req, res) => {
    res.send('API is working');
});

app.get('/weather', async (req, res) => {
    const cityName = req.query.city;

    if (!process.env.WEATHER_API_KEY) {
        return res.status(500).json({ error: "Missing API key" });
    }

    try {
        const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${process.env.WEATHER_API_KEY}`);
        const weatherData = await weatherResponse.json();

        if (weatherResponse.ok) {
            const weatherInfo = {
                city: weatherData.name,
                country: weatherData.sys.country,
                temperature: weatherData.main.temp - 273.15,
                weather: weatherData.weather[0].description
            };

            const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${process.env.WEATHER_API_KEY}`);
            const forecastData = await forecastResponse.json();

            if (forecastResponse.ok) {
                const forecastList = forecastData.list.slice(0, 5).map((item) => ({
                    date: item.dt_txt,
                    temperature: item.main.temp - 273.15,
                    weather: item.weather[0].description
                }));

                return res.json({ weather: weatherInfo, forecast: forecastList });
            } else {
                return res.status(forecastResponse.status).json({ error: forecastData.message });
            }
        } else {
            return res.status(weatherResponse.status).json({ error: weatherData.message });
        }
    } catch (error) {
        return res.status(500).json({ error: "Failed to fetch weather data" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});