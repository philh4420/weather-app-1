import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, CircularProgress, Grid, Tooltip, IconButton, useTheme
} from '@mui/material';
import {
  Thermostat as ThermostatIcon, Opacity as OpacityIcon, Speed as SpeedIcon,
  Explore as ExploreIcon, Visibility as VisibilityIcon, ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon, Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { fetchOpenWeatherMapData } from '../api/openWeatherMapAPI';
import InfoBox from './InfoBox';
import { ReactComponent as ThermometerMercuryIcon } from '../weather-icons/thermometer.svg';
import { styled } from '@mui/system';

const ScrollableBox = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(3),
  maxHeight: '68vh',
  overflowY: 'auto',
  backgroundColor: theme.palette.background.paper,
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

const FeelsLike = ({ lat, lon }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const getWeatherData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await fetchOpenWeatherMapData(lat, lon);
      setWeatherData(data);
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
    return <Typography variant="h6" color="error">{t('error_loading_feels_like')}</Typography>;
  }

  if (!weatherData) {
    return <Typography variant="h6" color="textSecondary">{t('no_weather_data')}</Typography>;
  }

  const {
    main: { feels_like, temp_min, temp_max, humidity, pressure },
    wind: { speed, deg },
    visibility,
  } = weatherData;

  return (
    <ScrollableBox>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
        <Tooltip title={t('refresh')} arrow>
          <IconButton onClick={refreshWeatherData} sx={{ color: theme.palette.primary.main }}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <Typography
        variant="h5"
        gutterBottom
        sx={{ fontWeight: theme.typography.h5.fontWeight, textAlign: 'center', mb: theme.spacing(3) }}
      >
        {t('feels_like_temperature')}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: theme.spacing(3), width: '100%' }}>
        <ThermometerMercuryIcon className="weather-icon" />
      </Box>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
          <InfoBox
            icon={<ThermostatIcon sx={{ fontSize: 40 }} />}
            label={t('feels_like')}
            value={`${feels_like}°C`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <InfoBox
            icon={<ArrowDownwardIcon sx={{ fontSize: 40 }} />}
            label={t('temp_min')}
            value={`${temp_min}°C`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <InfoBox
            icon={<ArrowUpwardIcon sx={{ fontSize: 40 }} />}
            label={t('temp_max')}
            value={`${temp_max}°C`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <InfoBox
            icon={<OpacityIcon sx={{ fontSize: 40 }} />}
            label={t('humidity')}
            value={`${humidity}%`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <InfoBox
            icon={<SpeedIcon sx={{ fontSize: 40 }} />}
            label={t('pressure')}
            value={`${pressure} hPa`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <InfoBox
            icon={<VisibilityIcon sx={{ fontSize: 40 }} />}
            label={t('visibility')}
            value={`${visibility} m`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <InfoBox
            icon={<SpeedIcon sx={{ fontSize: 40 }} />}
            label={t('wind_speed')}
            value={`${speed} m/s`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <InfoBox
            icon={<ExploreIcon sx={{ fontSize: 40 }} />}
            label={t('wind_direction')}
            value={`${deg}°`}
          />
        </Grid>
      </Grid>
    </ScrollableBox>
  );
};

export default FeelsLike;
