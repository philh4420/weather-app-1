import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, CircularProgress, Grid, Tooltip, IconButton, useTheme,
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
import InfoBox from './InfoBox3';
import { alpha } from '@mui/system';

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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100%' }}>
        <CircularProgress />
      </Box>
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
    main: { temp, feels_like, temp_min, temp_max, humidity, pressure, sea_level, grnd_level },
    wind: { speed, gust, deg },
    clouds: { all: cloudiness },
    visibility, rain, snow, sys: { sunrise, sunset }, name,
  } = weatherData;

  const weatherDescription = weather[0].description.toLowerCase().replace(/ /g, '_');

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        width: '100%',
        padding: theme.spacing(3),
        minHeight: '60vh',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[2],
        borderRadius: theme.shape.borderRadius,
        overflowY: 'auto',
        maxHeight: '65vh',
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
      }}
    >
      <Tooltip title={t('refresh')} arrow>
        <IconButton
          onClick={refreshWeatherData}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 1,
            color: theme.palette.primary.main,
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.2),
            },
          }}
        >
          <RefreshIcon />
        </IconButton>
      </Tooltip>
      <Typography
        variant="h5"
        gutterBottom
        sx={{ fontWeight: theme.typography.h5.fontWeight, textAlign: 'center', mb: theme.spacing(3) }}
      >
        {t('current_weather_in', { city: name })}
      </Typography>
      <Box display="flex" justifyContent="center" alignItems="center" sx={{ mb: 2 }}>
        {weatherIcon && (
          <img src={weatherIcon} alt={weather[0].description} className="weather-icon" style={{ marginRight: theme.spacing(2) }} />
        )}
        <Typography variant="h6" sx={{ fontWeight: theme.typography.h6.fontWeight }}>
          {t(weatherDescription, { defaultValue: weather[0].description })}
        </Typography>
      </Box>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
          <InfoBox icon={<ThermostatIcon sx={{ fontSize: 40 }} />} label={t('temperature')} value={`${temp}°C`} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <InfoBox icon={<ThermostatIcon sx={{ fontSize: 40 }} />} label={t('feels_like')} value={`${feels_like}°C`} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <InfoBox icon={<ArrowDownwardIcon sx={{ fontSize: 40 }} />} label={t('temp_min')} value={`${temp_min}°C`} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <InfoBox icon={<ArrowUpwardIcon sx={{ fontSize: 40 }} />} label={t('temp_max')} value={`${temp_max}°C`} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <InfoBox icon={<OpacityIcon sx={{ fontSize: 40 }} />} label={t('humidity')} value={`${humidity}%`} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <InfoBox icon={<SpeedIcon sx={{ fontSize: 40 }} />} label={t('pressure')} value={`${pressure} hPa`} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <InfoBox icon={<CloudIcon sx={{ fontSize: 40 }} />} label={t('cloudiness')} value={`${cloudiness}%`} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <InfoBox icon={<VisibilityIcon sx={{ fontSize: 40 }} />} label={t('visibility')} value={`${visibility} m`} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <InfoBox icon={<WindPowerIcon sx={{ fontSize: 40 }} />} label={t('wind_speed')} value={`${speed} m/s`} />
        </Grid>
        {gust && (
          <Grid item xs={12} sm={6} md={4}>
            <InfoBox icon={<WindPowerIcon sx={{ fontSize: 40 }} />} label={t('wind_gust')} value={`${gust} m/s`} />
          </Grid>
        )}
        <Grid item xs={12} sm={6} md={4}>
          <InfoBox icon={<ExploreIcon sx={{ fontSize: 40 }} />} label={t('wind_direction')} value={`${deg}°`} />
        </Grid>
        {weatherData.clouds && (
          <Grid item xs={12} sm={6} md={4}>
            <InfoBox icon={<CloudQueueIcon sx={{ fontSize: 40 }} />} label={t('cloud_coverage')} value={`${weatherData.clouds.all}%`} />
          </Grid>
        )}
        {weatherData.main && (
          <Grid item xs={12} sm={6} md={4}>
            <InfoBox icon={<AirPressureIcon sx={{ fontSize: 40 }} />} label={t('air_pressure')} value={`${weatherData.main.pressure} hPa`} />
          </Grid>
        )}
        {weatherData.uvi && (
          <Grid item xs={12} sm={6} md={4}>
            <InfoBox icon={<UVIndexIcon sx={{ fontSize: 40 }} />} label={t('uv_index')} value={weatherData.uvi} />
          </Grid>
        )}
        <Grid item xs={12} sm={6} md={4}>
          <InfoBox icon={<WbSunnyIcon sx={{ fontSize: 40 }} />} label={t('sunrise')} value={new Date(sunrise * 1000).toLocaleTimeString()} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <InfoBox icon={<NightsStayIcon sx={{ fontSize: 40 }} />} label={t('sunset')} value={new Date(sunset * 1000).toLocaleTimeString()} />
        </Grid>
        {rain && rain['1h'] && (
          <Grid item xs={12} sm={6} md={4}>
            <InfoBox icon={<GrainIcon sx={{ fontSize: 40 }} />} label={t('rain_volume_last_1_hour')} value={`${rain['1h']} mm`} />
          </Grid>
        )}
        {rain && rain['3h'] && (
          <Grid item xs={12} sm={6} md={4}>
            <InfoBox icon={<GrainIcon sx={{ fontSize: 40 }} />} label={t('rain_volume_last_3_hours')} value={`${rain['3h']} mm`} />
          </Grid>
        )}
        {snow && snow['1h'] && (
          <Grid item xs={12} sm={6} md={4}>
            <InfoBox icon={<AcUnitIcon sx={{ fontSize: 40 }} />} label={t('snow_volume_last_1_hour')} value={`${snow['1h']} mm`} />
          </Grid>
        )}
        {snow && snow['3h'] && (
          <Grid item xs={12} sm={6} md={4}>
            <InfoBox icon={<AcUnitIcon sx={{ fontSize: 40 }} />} label={t('snow_volume_last_3_hours')} value={`${snow['3h']} mm`} />
          </Grid>
        )}
        {sea_level && (
          <Grid item xs={12} sm={6} md={4}>
            <InfoBox icon={<WavesIcon sx={{ fontSize: 40 }} />} label={t('sea_level_pressure')} value={`${sea_level} hPa`} />
          </Grid>
        )}
        {grnd_level && (
          <Grid item xs={12} sm={6} md={4}>
            <InfoBox icon={<WavesIcon sx={{ fontSize: 40 }} />} label={t('ground_level_pressure')} value={`${grnd_level} hPa`} />
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default CurrentWeather;
