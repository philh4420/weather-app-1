import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Skeleton, IconButton, Tooltip, useTheme,
} from '@mui/material';
import {
  Thermostat as ThermostatIcon, Opacity as OpacityIcon, Speed as SpeedIcon,
  Explore as ExploreIcon, WbSunny as WbSunnyIcon, NightsStay as NightsStayIcon,
  Cloud as CloudIcon, Visibility as VisibilityIcon, ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon, Grain as GrainIcon, AcUnit as AcUnitIcon,
  Waves as WavesIcon, WindPower as WindPowerIcon, WbIncandescent as UVIndexIcon,
  CloudQueue as CloudQueueIcon, FilterDrama as AirPressureIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { fetchOpenWeatherMapData } from '../api/openWeatherMapAPI';
import InfoBox from './InfoBox';
import './Weather.css'; // Import the CSS file

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

const CurrentWeather = ({ lat, lon }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [weatherIcon, setWeatherIcon] = useState(null);

  const getWeatherData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await fetchOpenWeatherMapData(lat, lon);
      setWeatherData(data);

      const iconCode = data.weather[0].icon;
      const iconName = iconMapping[iconCode] || iconMapping['01d'];
      const icon = await import(`../weather-icons/${iconName}`);
      setWeatherIcon(icon.default);
    } catch (error) {
      console.error(t('error_fetching_data'), error);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [lat, lon, t]);

  useEffect(() => {
    getWeatherData();
  }, [getWeatherData]);

  const refreshWeatherData = () => {
    getWeatherData();
  };

  if (loading) {
    return (
      <Card sx={{ width: '100%', mt: 2, borderRadius: theme.shape.borderRadius, boxShadow: theme.shadows[4] }}>
        <CardContent>
          <Skeleton variant="text" width={300} height={40} sx={{ margin: '0 auto', mb: 3 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} md={6} lg={4}>
              <Skeleton variant="rectangular" width="100%" height={200} />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Skeleton variant="rectangular" width="100%" height={200} />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Skeleton variant="rectangular" width="100%" height={200} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return <Typography variant="h6" color="error">{t('error_loading_weather')}</Typography>;
  }

  if (!weatherData) {
    return <Typography variant="h6" color="textSecondary">{t('no_weather_data')}</Typography>;
  }

  const {
    weather,
    main: {
      temp, feels_like, temp_min, temp_max, humidity, pressure, sea_level, grnd_level,
    },
    wind: { speed, gust, deg },
    clouds: { all: cloudiness },
    visibility, rain, snow, sys: { sunrise, sunset }, name,
  } = weatherData;

  const weatherDescription = weather[0].description.toLowerCase().replace(/ /g, '_');

  return (
    <Card sx={{
      width: '100%', height: '100%', borderRadius: theme.shape.borderRadius, boxShadow: theme.shadows[4], position: 'relative',
      background: theme.palette.mode === 'dark' ? theme.palette.background.paper : 'linear-gradient(to right, #f7f8f9, #f1f2f3)',
    }}>
      <Tooltip title={t('refresh')} arrow>
        <IconButton
          onClick={refreshWeatherData}
          sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1, color: theme.palette.primary.main }}
        >
          <RefreshIcon />
        </IconButton>
      </Tooltip>
      <CardContent sx={{ padding: theme.spacing(2.5) }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: theme.typography.h5.fontWeight, textAlign: 'center', mb: theme.spacing(3) }}
        >
          {t('current_weather_in', { city: name })}
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center" alignItems="center" sx={{ mb: 2 }}>
              {weatherIcon && (
                <img src={weatherIcon} alt={weather[0].description} className="weather-icon" />
              )}
              <Typography variant="h6" sx={{ fontWeight: theme.typography.h6.fontWeight, ml: 2 }}>
                {t(weatherDescription, { defaultValue: weather[0].description })}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} lg={4}>
            <InfoBox icon={<ThermostatIcon />} label={t('temperature')} value={`${temp}°C`} />
            <InfoBox icon={<ThermostatIcon />} label={t('feels_like')} value={`${feels_like}°C`} />
            <InfoBox icon={<ArrowDownwardIcon />} label={t('temp_min')} value={`${temp_min}°C`} />
            <InfoBox icon={<ArrowUpwardIcon />} label={t('temp_max')} value={`${temp_max}°C`} />
            <InfoBox icon={<OpacityIcon />} label={t('humidity')} value={`${humidity}%`} />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <InfoBox icon={<SpeedIcon />} label={t('pressure')} value={`${pressure} hPa`} />
            <InfoBox icon={<CloudIcon />} label={t('cloudiness')} value={`${cloudiness}%`} />
            <InfoBox icon={<VisibilityIcon />} label={t('visibility')} value={`${visibility} m`} />
            <InfoBox icon={<WindPowerIcon />} label={t('wind_speed')} value={`${speed} m/s`} />
            {gust && <InfoBox icon={<WindPowerIcon />} label={t('wind_gust')} value={`${gust} m/s`} />}
            <InfoBox icon={<ExploreIcon />} label={t('wind_direction')} value={`${deg}°`} />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            {weatherData.clouds && (
              <InfoBox icon={<CloudQueueIcon />} label={t('cloud_coverage')} value={`${weatherData.clouds.all}%`} />
            )}
            {weatherData.main && (
              <InfoBox icon={<AirPressureIcon />} label={t('air_pressure')} value={`${weatherData.main.pressure} hPa`} />
            )}
            {weatherData.uvi && (
              <InfoBox icon={<UVIndexIcon />} label={t('uv_index')} value={weatherData.uvi} />
            )}
            <InfoBox icon={<WbSunnyIcon />} label={t('sunrise')} value={new Date(sunrise * 1000).toLocaleTimeString()} />
            <InfoBox icon={<NightsStayIcon />} label={t('sunset')} value={new Date(sunset * 1000).toLocaleTimeString()} />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            {rain && rain['1h'] && <InfoBox icon={<GrainIcon />} label={t('rain_volume_last_1_hour')} value={`${rain['1h']} mm`} />}
            {rain && rain['3h'] && <InfoBox icon={<GrainIcon />} label={t('rain_volume_last_3_hours')} value={`${rain['3h']} mm`} />}
            {snow && snow['1h'] && <InfoBox icon={<AcUnitIcon />} label={t('snow_volume_last_1_hour')} value={`${snow['1h']} mm`} />}
            {snow && snow['3h'] && <InfoBox icon={<AcUnitIcon />} label={t('snow_volume_last_3_hours')} value={`${snow['3h']} mm`} />}
            {sea_level && <InfoBox icon={<WavesIcon />} label={t('sea_level_pressure')} value={`${sea_level} hPa`} />}
            {grnd_level && <InfoBox icon={<WavesIcon />} label={t('ground_level_pressure')} value={`${grnd_level} hPa`} />}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CurrentWeather;
