import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, CircularProgress, Grid, Tooltip, IconButton, useTheme
} from '@mui/material';
import {
  Thermostat as ThermostatIcon, Opacity as OpacityIcon, Speed as SpeedIcon, Visibility as VisibilityIcon, ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon, Refresh as RefreshIcon,
} from '@mui/icons-material';
import { alpha } from '@mui/system';
import { useTranslation } from 'react-i18next';
import { fetchOpenWeatherMapData } from '../api/openWeatherMapAPI';
import InfoBox from './InfoBox';
import { ReactComponent as ThermometerMercuryIcon } from '../weather-icons/thermometer.svg';

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
    visibility
  } = weatherData;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        width: '100%',
        padding: theme.spacing(3),
        minHeight: '55vh',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[2],
        borderRadius: theme.shape.borderRadius,
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
        variant="h6"
        sx={{ fontWeight: 'bold', color: theme.palette.text.primary, marginTop: theme.spacing(2) }}
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
      </Grid>
    </Box>
  );
};

export default FeelsLike;
