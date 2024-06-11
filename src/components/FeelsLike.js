import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Card, CardContent, CircularProgress, Grid, Tooltip, IconButton, useTheme,
} from '@mui/material';
import { Thermostat as ThermostatIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { fetchOpenWeatherMapData } from '../api/openWeatherMapAPI';
import InfoBox from './InfoBox';
import { ReactComponent as ThermometerMercuryIcon } from '../weather-icons/thermometer.svg';

const FeelsLike = ({ lat, lon }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [feelsLikeTemp, setFeelsLikeTemp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const getWeatherData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await fetchOpenWeatherMapData(lat, lon);
      setFeelsLikeTemp(data.main.feels_like);
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

  return (
    <Card sx={{
      width: '100%',
      borderRadius: theme.shape.borderRadius,
      boxShadow: theme.shadows[4],
      position: 'relative',
      padding: theme.spacing(3),
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
        <Tooltip title={t('refresh')} arrow>
          <IconButton
            onClick={refreshWeatherData}
            sx={{ color: theme.palette.primary.main }}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <CardContent>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: theme.typography.h5.fontWeight, textAlign: 'center', mb: theme.spacing(3) }}
        >
          {t('feels_like_temperature')}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: theme.spacing(3), width: '100%' }} >
          <ThermometerMercuryIcon className="weather-icon" />
        </Box>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
            <InfoBox
              icon={<ThermostatIcon sx={{ fontSize: 40 }} />}
              label={t('feels_like')}
              value={`${feelsLikeTemp}°C`}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default FeelsLike;
