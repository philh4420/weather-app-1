import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Card, CardContent, Skeleton, IconButton, Tooltip, useTheme,
} from '@mui/material';
import { Thermostat as ThermostatIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { fetchOpenWeatherMapData } from '../api/openWeatherMapAPI';

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
      <Card sx={{ width: '100%', mt: 2, borderRadius: theme.shape.borderRadius, boxShadow: theme.shadows[4] }}>
        <CardContent>
          <Skeleton variant="text" width={300} height={40} sx={{ margin: '0 auto', mb: 3 }} />
        </CardContent>
      </Card>
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
      <Tooltip title={t('refresh')} arrow>
        <IconButton
          onClick={refreshWeatherData}
          sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1, color: theme.palette.primary.main }}
        >
          <RefreshIcon />
        </IconButton>
      </Tooltip>
      <Typography
        variant="h5"
        gutterBottom
        sx={{ fontWeight: theme.typography.h5.fontWeight, textAlign: 'center', mb: theme.spacing(3) }}
      >
        {t('feels_like_temperature')}
      </Typography>
      <Box display="flex" justifyContent="center" alignItems="center" sx={{ mb: 2 }}>
        <ThermostatIcon sx={{ fontSize: 40 }} />
        <Typography variant="h6" sx={{ fontWeight: theme.typography.h6.fontWeight, ml: 2 }}>
          {feelsLikeTemp}°C
        </Typography>
      </Box>
    </Card>
  );
};

export default FeelsLike;
