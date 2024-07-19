import React, { useState, useEffect } from 'react';
import InputField from './components/InputField';
import CurrentWeather from './components/CurrentWeather';
import WeatherChart from './components/WeatherChart';
import { fetchWeatherData, fetchCurrentWeather } from './api/weatherAPI';

const App = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState([]);
  const [currentWeather, setCurrentWeather] = useState({});

  useEffect(() => {
    if (city) {
      fetchWeatherData(city).then((data) => {
        setWeatherData(data.list);
      });

      fetchCurrentWeather(city).then((data) => {
        setCurrentWeather(data);
      });
    }
  }, [city]);

  const handleInputChange = (e) => {
    setCity(e.target.value);
  };

  return (
    <div>
      <InputField city={city} handleInputChange={handleInputChange} />
      {currentWeather && (
        <CurrentWeather weather={currentWeather} />
      )}
      {weatherData && (
        <WeatherChart weatherData={weatherData} />
      )}
    </div>
  );
};

export default App;