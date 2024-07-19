import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const WeatherChart = ({ weatherData }) => {
  return (
    <LineChart width={500} height={300} data={weatherData}>
      <Line type="monotone" dataKey="temperature" stroke="#8884d8" />
      <Line type="monotone" dataKey="humidity" stroke="#82ca9d" />
      <XAxis dataKey="date" />
      <YAxis />
      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
      <Tooltip />
    </LineChart>
  );
};

export default WeatherChart;