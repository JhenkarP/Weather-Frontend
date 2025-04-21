import React, { useState } from "react";
import './Weather.css';
import search from '../Source/search.png';
import sunny from '../Source/sunny.png';
import snow from '../Source/snow.png';
import drizzle from '../Source/drizzle.png';
import rain from '../Source/rain.png';
import cloudy1 from '../Source/cloudy1.png';
import cloudy2 from '../Source/cloudy2.png';
import humidityIcon from '../Source/humidity.png';
import windIcon from '../Source/wind.png';
import clear from '../Source/clear.png';
import moon from '../Source/moon.png';

function Weather() {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);

    const icons = {
        "Clouds": cloudy1,
        "Rain": rain,
        "Snow": snow,
        "Drizzle": drizzle,
        "Clear": sunny,
    };

    function getIcon(weather, timestamp, timezoneOffset, sunrise, sunset) {
        const localTime = timestamp + timezoneOffset;
        const isDay = localTime >= sunrise && localTime < sunset;
        if (weather === "Clear") {
            return isDay ? sunny : moon;
        }
        if (weather === "Clouds") {
            return isDay ? cloudy1 : cloudy2;
        }
        return icons[weather] || sunny;
    }

    async function handleSearch() {
        if (!city) return;
        try {
            const response = await fetch(`http://localhost:8080/api/weather/current?city=${city}`);
            if (!response.ok) {
                throw new Error("Weather not found");
            }
            const data = await response.json();
            console.log(data);
            setWeatherData(data);
        } catch (err) {
            console.error(err);
            alert("Error fetching weather data");
        }
    }

    return (
        <div className="weather">
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Location"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
                <img src={search} alt="Search" className="search-icon" onClick={handleSearch} />
            </div>

            {weatherData && (
                <>
                    <img
                        src={getIcon(
                            weatherData.weather,
                            weatherData.dt,
                            weatherData.timezone,
                            weatherData.sunrise,
                            weatherData.sunset
                        )}
                        alt={weatherData.weather}
                        className="weather-icon"
                    />
                    <p className="temperature">{Math.floor(weatherData.temperature)}°C</p>
                    <p className="location">{weatherData.city}</p>
                    <div className="weather-data">
                        <div className="col">
                            <img src={humidityIcon} alt="Humidity" />
                            <div>
                                <p>{weatherData.humidity}%</p>
                                <span>Humidity</span>
                            </div>
                        </div>
                        <div className="col">
                            <img src={windIcon} alt="Wind Speed" />
                            <div>
                                <p>{weatherData.windSpeed} km/h</p>
                                <span>Wind Speed</span>
                            </div>
                        </div>
                    </div>
                    <img
                        src={clear}
                        alt="Clear"
                        className="clear-icon"
                        onClick={() => {
                            setWeatherData(null);
                            setCity('');
                        }}
                    />
                </>
            )}
        </div>
    );
}

export default Weather;
