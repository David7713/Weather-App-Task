import React, { useState, useEffect } from 'react';
import './Weather.css';
import { apiKey } from '../config/config';

const Weather = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [switcher, setSwitcher] = useState(null);



  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          getWeatherByCoordinates(latitude, longitude);
        },
        (error) => {
          alert('Please enter a city manually if location access is denied.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }, []);




  const getWeatherByCoordinates = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );
      const data = await response.json();
      setWeatherData(data);
      getForecast(lat, lon);
    } catch {
      alert('failed to get dataa.');
    }
  };






  const getForecast = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );
      const data = await response.json();
      const dailyData = data.list.reduce((acc, item) => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        if (!acc[date]) acc[date] = [];
        acc[date].push(item);
        return acc;
      }, {});
      setForecastData(dailyData);

      const today = new Date().toLocaleDateString();
      setSelectedDay(today);
    } catch {
      alert('Failed to fetch forecast data.');
    }
  };



  const getWeatherByCity = async () => {
    if (city) {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );
        const data = await response.json();
        if (data.cod === 200) {
          setWeatherData(data);
          getForecast(data.coord.lat, data.coord.lon);
        } else {
          alert('Please enter correct city name');
          setWeatherData(null);
          setForecastData({});
        }
      } catch {
        alert('Failed to get data.');
      }
    }
  };



  return (
    <div className="weather-app">
      <div className='headline'>
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={getWeatherByCity}>Search City</button>


        <div className='celsius-fahrenheit-convert'>
          <input type='radio'
          ></input>
          <label>C</label>
          <input type='radio' ></input>
          <label>F</label>
        </div>
      </div>

      {weatherData && weatherData.main && (
        <div className="current-weather">
          <div className='current-city-weather'>
            <h3>{weatherData.name}</h3>
            <p>{weatherData.main.temp}°C</p>
            <img
              src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}

              className='weather-icon'
            />
            <p>{weatherData.weather[0].description}</p>
          </div>





          {selectedDay && forecastData[selectedDay] && (
            <div className="current-day-hourly">
              <h4>{selectedDay === new Date().toLocaleDateString() ? "Today's" : `${selectedDay}'s`} Hourly Forecast</h4>
              <div className="hourly-details">
                {forecastData[selectedDay].map((hourlyData, index) => (
                  <div key={index} className="hourly-weather">
                    <p>{new Date(hourlyData.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    <p>{hourlyData.main.temp}°C</p>
                    <img
                      src={`https://openweathermap.org/img/wn/${hourlyData.weather[0].icon}@2x.png`}

                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}





      {Object.keys(forecastData).length > 0 && (
        <div className="forecast">
          {Object.keys(forecastData).slice(0, 4).map((date) => {
            const dailyTemps = forecastData[date].map(item => item.main.temp);
            const maxTemp = Math.max(...dailyTemps);
            return (
              <div
                key={date}
                className={`forecast-day ${selectedDay === date ? 'selected' : ''}`}
                onClick={() => setSelectedDay(date)}
              >
                <p>{date === new Date().toLocaleDateString() ? 'Today' : date}</p>
                <div className='forecast-details-icons'>
                  <p className='forecast-temp'> {maxTemp}°C</p>
                  <img src={`https://openweathermap.org/img/wn/${forecastData[date][0].weather[0].icon}@2x.png`}></img>
                </div>
              </div>
            );
          })}
        </div>
      )}



    </div>
  );
};

export default Weather;