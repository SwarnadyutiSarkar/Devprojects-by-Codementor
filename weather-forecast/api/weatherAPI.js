import axios from 'axios';

const API_KEY = 'YOUR_WEATHER_API_KEY';
const API_URL = 'https://api.openweathermap.org/data/2.5';

const fetchWeatherData = async (city) => {
  const response = await axios.get(`${API_URL}/forecast`, {
    params: {
      q: city,
      units: 'metric',
      appid: API_KEY,
    },
  });

  return response.data;
};

const fetchCurrentWeather = async (city) => {
  const response = await axios.get(`${API_URL}/weather`, {
    params: {
      q: city,
      units: 'metric',
      appid: API_KEY,
    },
  });

  return response.data;
};

export { fetchWeatherData, fetchCurrentWeather };