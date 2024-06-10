import axios from 'axios';

const API_KEY = process.env.REACT_APP_OPENWEATHERMAP_API_KEY;

export const fetchOpenWeatherMapData = async (lat, lon) => {
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
  const uvUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

  try {
    const [weatherResponse, uvResponse] = await Promise.all([
      axios.get(weatherUrl),
      axios.get(uvUrl)
    ]);

    return { ...weatherResponse.data, uvi: uvResponse.data.value };
  } catch (error) {
    console.error('Error fetching OpenWeatherMap data:', error);
    throw error;
  }
};

export const fetchOpenWeatherMapDataByCity = async (city) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching OpenWeatherMap data:', error);
    throw error;
  }
};

export const fetchOpenWeatherMap5DayData = async (lat, lon) => {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching 5-day forecast data:', error);
    throw error;
  }
};

export const fetchAirPollutionData = async (lat, lon) => {
  const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching air pollution data:', error);
    throw error;
  }
};

export const fetchHistoricalAirPollutionData = async (lat, lon) => {
  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
  const oneWeekAgo = currentTime - (7 * 24 * 60 * 60); // 7 days ago

  const url = `https://api.openweathermap.org/data/2.5/air_pollution/history?lat=${lat}&lon=${lon}&start=${oneWeekAgo}&end=${currentTime}&appid=${API_KEY}`;

  try {
    const response = await axios.get(url);
    return response.data.list || []; // Return the list of data points
  } catch (error) {
    console.error('Error fetching historical air pollution data:', error);
    throw error;
  }
};

