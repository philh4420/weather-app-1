import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import { alpha } from '@mui/system';
import { useTranslation } from 'react-i18next';
import { fetchWeatherAPIData } from '../api/weatherAPI';
import { styled } from '@mui/system';
import { Refresh as RefreshIcon, AccessTime as TimeIcon, Thermostat as TemperatureIcon } from '@mui/icons-material';
import InfoBox from './InfoBox';

const ScrollableGrid = styled('div')(({ theme }) => ({
  display: 'flex',
  overflowX: 'auto',
  padding: '10px 16px',
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
  minWidth: '150px',
  marginBottom: theme.spacing(2),
  marginRight: theme.spacing(2),
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
    <Box sx={{ width: '100%', mt: 2, p: 2, borderRadius: theme.shape.borderRadius, bgcolor: theme.palette.background.default, position: 'relative' }}>
      <Tooltip title={t('refresh')} arrow>
        <IconButton
          onClick={refreshForecastData}
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
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', mb: 3 }}>
        {t('24_hour_forecast')}
      </Typography>
      <ScrollableGrid>
        {hourlyForecast.map((hour, index) => {
          const conditionText = hour.condition.text.trim().toLowerCase();
          const conditionTextKey = conditionText.replace(/ /g, '_');

          return (
            <ForecastItem key={index} theme={theme}>
              <InfoBox
                icon={<TimeIcon sx={{ fontSize: 40 }} />}
                label={t('Time')}
                value={new Date(hour.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              />
              <InfoBox
                icon={<img src={hour.condition.icon} alt={hour.condition.text} className="weather-icon-1" />}
                label={t('Condition')}
                value={t(conditionTextKey, { defaultValue: hour.condition.text })}
              />
              <InfoBox
                icon={<TemperatureIcon sx={{ fontSize: 40 }} />}
                label={t('Temperature')}
                value={`${hour.temp_c}°C`}
              />
            </ForecastItem>
          );
        })}
      </ScrollableGrid>
    </Box>
  );
};

export default HourlyForecast;
