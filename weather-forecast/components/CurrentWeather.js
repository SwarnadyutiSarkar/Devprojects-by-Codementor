import React from 'react';

const CurrentWeather = ({ weather }) => {
  return (
    <div>
      <h2>Current Weather</h2>
      <p>Weather Condition: {weather.condition}</p>
      <p>Temperature: {weather.temperature}°C</p>
      <p>Humidity: {weather.humidity}%</p>
      <p>Wind Speed: {weather.windSpeed} km/h</p>
      <p>Date and Time: {weather.dateTime}</p>
    </div>
  );
};

export default CurrentWeather;