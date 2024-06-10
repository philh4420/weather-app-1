import axios from 'axios';

const API_KEY = process.env.REACT_APP_WEATHERAPI_API_KEY;

export const fetchWeatherAPIData = async (query) => {
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${query}&days=1&hourly=1`;


  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching WeatherAPI data:', error);
    throw error;
  }
};
