import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { fetchWeatherAPIData } from '../api/weatherAPI';
import { styled } from '@mui/system';
import { Refresh as RefreshIcon } from '@mui/icons-material';

const ScrollableGrid = styled('div')(({ theme }) => ({
  display: 'flex',
  overflowX: 'auto',
  padding: '10px 16px',  // Add padding to the ScrollableGrid
  whiteSpace: 'nowrap',
  '&::-webkit-scrollbar': {
    height: '10px',
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

const ForecastItem = styled(Box)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  minWidth: '100px',
  marginBottom: theme.spacing(2),
  marginRight: theme.spacing(2), // Add margin right to create space between items
  flexShrink: 0,
  textAlign: 'center',
  padding: theme.spacing(2),
  display: 'inline-block',
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  '&:hover': {
    boxShadow: theme.shadows[6],
  },
}));

const HourlyForecast = ({ lat, lon }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getForecastData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherAPIData(`${lat},${lon}`);
      setForecastData(data);
    } catch (error) {
      console.error('Error fetching forecast data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [lat, lon]);

  useEffect(() => {
    getForecastData();
  }, [getForecastData]);

  const refreshForecastData = () => {
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

  const hourlyForecast = forecastData.forecast.forecastday[0].hour.concat(
    forecastData.forecast.forecastday[1]?.hour || []
  ).slice(0, 24);

  return (
    <Box sx={{ width: '100%', marginTop: '16px', borderRadius: theme.shape.borderRadius, padding: theme.spacing(3), bgcolor: theme.palette.background.default, position: 'relative' }}>
      <Tooltip title={t('refresh')} arrow>
        <IconButton
          onClick={refreshForecastData}
          sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1, color: theme.palette.primary.main }}
        >
          <RefreshIcon />
        </IconButton>
      </Tooltip>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', mb: 3, color: theme.palette.text.primary }}>
        {t('24_hour_forecast')}
      </Typography>
      <ScrollableGrid>
        {hourlyForecast.map((hour, index) => {
          const conditionText = hour.condition.text.trim().toLowerCase();
          const conditionTextKey = conditionText.replace(/ /g, '_');

          return (
            <ForecastItem key={index} theme={theme}>
              <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
                {new Date(hour.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Typography>
              <img src={hour.condition.icon} alt={hour.condition.text} className="weather-icon-1" />
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
                {hour.temp_c}°C
              </Typography>
              <Typography variant="body2" sx={{ fontStyle: 'italic', color: theme.palette.text.secondary }}>
                {t(conditionTextKey, { defaultValue: hour.condition.text })}
              </Typography>
            </ForecastItem>
          );
        })}
      </ScrollableGrid>
    </Box>
  );
};

export default HourlyForecast;
