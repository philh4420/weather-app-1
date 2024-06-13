import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  Thermostat as ThermostatIcon,
  Opacity as OpacityIcon,
  Speed as SpeedIcon,
  Cloud as CloudIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { fetchOpenWeatherMap5DayData } from '../api/openWeatherMapAPI';
import { styled } from '@mui/system';
import InfoBox from './InfoBox2';

const iconMapping = {
  "01d": "clear-day.svg",
  "01n": "clear-night.svg",
  "02d": "partly-cloudy-day.svg",
  "02n": "partly-cloudy-night.svg",
  "03d": "cloudy.svg",
  "03n": "cloudy.svg",
  "04d": "overcast-day.svg",
  "04n": "overcast-night.svg",
  "09d": "drizzle.svg",
  "09n": "drizzle.svg",
  "10d": "rain.svg",
  "10n": "rain.svg",
  "11d": "thunderstorms-day-rain.svg",
  "11n": "thunderstorms-night-rain.svg",
  "13d": "snow.svg",
  "13n": "snow.svg",
  "50d": "mist.svg",
  "50n": "mist.svg",
};

const ScrollableBox = styled(Box)(({ theme }) => ({
  maxHeight: '70vh',
  maxWidth: '100%',
  overflowY: 'auto',
  padding: theme.spacing(2),
  '&::-webkit-scrollbar': {
    width: '10px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.scrollbar.thumb,
    borderRadius: '10px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    backgroundColor: theme.palette.scrollbar.thumbHover,
  },
  msOverflowStyle: 'auto',
  scrollbarWidth: 'auto',
}));

const ForecastItem = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  textAlign: 'center',
  backgroundColor: theme.palette.background.paper,
  margin: theme.spacing(1),
  flexGrow: 1,
  '&:hover': {
    boxShadow: theme.shadows[6],
  },
}));

const FiveDayForecast = ({ lat, lon }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weatherIcons, setWeatherIcons] = useState({});

  const getForecastData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchOpenWeatherMap5DayData(lat, lon);
      setForecastData(data);

      const icons = await Promise.all(
        data.list.map(async (forecast) => {
          const iconCode = forecast.weather[0].icon;
          const iconName = iconMapping[iconCode] || iconMapping['not-available'];
          try {
            const icon = await import(`../weather-icons/${iconName}`);
            return { [iconCode]: icon.default };
          } catch (error) {
            console.error('Error loading weather icon:', error);
            return { [iconCode]: null };
          }
        })
      );

      const iconsMap = icons.reduce((acc, curr) => ({ ...acc, ...curr }), {});
      setWeatherIcons(iconsMap);

    } catch (error) {
      console.error('Error fetching 5-day forecast data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [lat, lon]);

  useEffect(() => {
    getForecastData();
  }, [getForecastData]);

  const refreshWeatherData = () => {
    getForecastData();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">{t('error_loading_forecast_data')}</Typography>;
  }

  if (!forecastData) {
    return <Typography>{t('no_forecast_data_available')}</Typography>;
  }

  const currentDate = new Date().toLocaleDateString();

  // Group forecast data by date, excluding the current date
  const groupedData = forecastData.list.reduce((acc, curr) => {
    const date = new Date(curr.dt_txt).toLocaleDateString();
    if (date !== currentDate) {
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(curr);
    }
    return acc;
  }, {});

  return (
    <Box sx={{ width: '100%', mt: 2, p: 2, borderRadius: theme.shape.borderRadius, backgroundColor: theme.palette.background.default, position: 'relative' }}>
      <Tooltip title={t('refresh')} arrow>
        <IconButton
          onClick={refreshWeatherData}
          sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1, color: theme.palette.primary.main }}
        >
          <RefreshIcon />
        </IconButton>
      </Tooltip>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', mb: 3 }}>
        {t('5_day_forecast')}
      </Typography>
      <ScrollableBox >
        <Grid container spacing={2} justifyContent="center">
          {Object.keys(groupedData).map((date, index) => (
            <Grid item xs={12} sm={8} md={4} lg={2} key={index}>
              <ForecastItem>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                    {date}
                  </Typography>
                  {groupedData[date].map((forecast, idx) => {
                    const weatherDescription = forecast.weather[0].description.toLowerCase().replace(/ /g, '_');
                    const weatherIcon = forecast.weather[0].icon;

                    return (
                      <Box key={idx} sx={{ mb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {new Date(forecast.dt_txt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                        <Box display="flex" justifyContent="center" alignItems="center" sx={{ mb: 1 }}>
                          {weatherIcons[weatherIcon] ? (
                            <img src={weatherIcons[weatherIcon]} alt={weatherIcon} className="weather-icon" />
                          ) : (
                            <div className="icon sun"></div>
                          )}
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            {t(weatherDescription, { defaultValue: forecast.weather[0].description })}
                          </Typography>
                        </Box>
                        <Grid container spacing={1} justifyContent="center">
                          <Grid item xs={12} sm={8}>
                            <InfoBox icon={<ThermostatIcon />} label={t('temperature')} value={`${forecast.main.temp}°C`} />
                          </Grid>
                          <Grid item xs={12} sm={8}>
                            <InfoBox icon={<OpacityIcon />} label={t('humidity')} value={`${forecast.main.humidity}%`} />
                          </Grid>
                          <Grid item xs={12} sm={8}>
                            <InfoBox icon={<SpeedIcon />} label={t('pressure')} value={`${forecast.main.pressure} hPa`} />
                          </Grid>
                          <Grid item xs={12} sm={8}>
                            <InfoBox icon={<CloudIcon />} label={t('cloudiness')} value={`${forecast.clouds.all}%`} />
                          </Grid>
                        </Grid>
                      </Box>
                    );
                  })}
                </CardContent>
              </ForecastItem>
            </Grid>
          ))}
        </Grid>
      </ScrollableBox>
    </Box>
  );
};

export default FiveDayForecast;
