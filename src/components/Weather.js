import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Skeleton,
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import { alpha } from '@mui/system';
import { useTranslation } from 'react-i18next';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import CurrentWeather from './CurrentWeather';
import HourlyForecast from './HourlyForecast';
import FiveDayForecast from './FiveDayForecast';
import AirPollution from './AirPollution';
import Wind from './Wind';
import FeelsLike from './FeelsLike';

const Weather = ({ handleThemeChange, handleLanguageChange, currentLanguage }) => {
  const { t, ready } = useTranslation();
  const theme = useTheme();

  const [location, setLocation] = useState({ lat: null, lon: null });
  const [locationName, setLocationName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLocationName = useCallback(async (lat, lon) => {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
      );
      const data = await response.json();
      return data.city || data.locality || data.principalSubdivision || t('unknown_location');
    } catch (error) {
      console.error("Error fetching location name:", error);
      return t('unknown_location');
    }
  }, [t]);

  const getLocation = useCallback(() => {
    setLoading(true);
    setError(null);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lon: longitude });
          const name = await fetchLocationName(latitude, longitude);
          setLocationName(name);
          setLoading(false);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setError(t('error_fetching_geolocation'));
          setLoading(false);
        }
      );
    } else {
      setError(t('geolocation_not_supported'));
      setLoading(false);
    }
  }, [fetchLocationName, t]);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  const handleLanguageChangeInternal = (language) => {
    handleLanguageChange(language);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return t('good_morning');
    }
    if (hour < 18) {
      return t('good_afternoon');
    }
    return t('good_evening');
  };

  if (!ready) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          transition: 'background-color 0.3s, color 0.3s',
          position: 'relative',
        }}
      >
        <Tooltip title={t('refresh')} arrow>
          <IconButton
            onClick={getLocation}
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
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '24px',
            padding: '0 16px',
          }}
        >
          {getGreeting()}, {t('weather_forecast')} {locationName && ` - ${locationName}`}
        </Typography>

        <Grid container spacing={2} justifyContent="center" sx={{ marginBottom: '16px' }}>
          <Grid item>
            <Button
              variant="contained"
              onClick={handleThemeChange}
              sx={{
                transition: 'background-color 0.3s',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                borderRadius: theme.shape.borderRadius,
                '&:hover': {
                  boxShadow: '0 6px 18px rgba(0, 0, 0, 0.15)',
                },
              }}
            >
              {t('toggle_dark_mode')}
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              fullWidth
              sx={{
                marginBottom: '32px',
                maxWidth: 400,
                padding: '12px 24px',
                transition: 'background-color 0.3s, box-shadow 0.3s',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                borderRadius: theme.shape.borderRadius,
                '&:hover': {
                  boxShadow: '0 6px 18px rgba(0, 0, 0, 0.15)',
                },
              }}
              onClick={getLocation}
            >
              {t('get_current_location')}
            </Button>
          </Grid>
          <Grid item>
            <FormControl
              variant="outlined"
              sx={{
                marginBottom: '16px',
                minWidth: 200,
                backgroundColor: theme.palette.background.paper,
                borderRadius: theme.shape.borderRadius,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                '& .MuiInputLabel-root': {
                  color: theme.palette.text.primary,
                },
                '& .MuiOutlinedInput-root': {
                  borderRadius: theme.shape.borderRadius,
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main,
                  },
                },
                '& .MuiSelect-select': {
                  padding: '12px 16px',
                },
                '& .MuiSelect-outlined': {
                  backgroundColor: theme.palette.background.paper,
                },
                '& .MuiSelect-select:focus': {
                  backgroundColor: theme.palette.background.paper,
                },
                '& .MuiMenuItem-root': {
                  backgroundColor: theme.palette.background.paper,
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                },
              }}
            >
              <InputLabel>{t('select_language')}</InputLabel>
              <Select
                value={currentLanguage}
                onChange={(e) => handleLanguageChangeInternal(e.target.value)}
                label={t('select_language')}
              >
                <MenuItem value="en">
                  <span role="img" aria-label="English">🇬🇧</span> {t('English')}
                </MenuItem>
                <MenuItem value="es">
                  <span role="img" aria-label="Español">🇪🇸</span> {t('Español')}
                </MenuItem>
                <MenuItem value="fr">
                  <span role="img" aria-label="Français">🇫🇷</span> {t('Français')}
                </MenuItem>
                <MenuItem value="de">
                  <span role="img" aria-label="Deutsch">🇩🇪</span> {t('Deutsch')}
                </MenuItem>
                <MenuItem value="ro">
                  <span role="img" aria-label="Română">🇷🇴</span> {t('Română')}
                </MenuItem>
                <MenuItem value="bg">
                  <span role="img" aria-label="Български">🇧🇬</span> {t('Български')}
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <Box
        sx={{
          padding: '32px',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          transition: 'background-color 0.3s, color 0.3s',
          position: 'relative',
        }}
      >
        {loading ? (
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : location.lat && location.lon ? (
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <HourlyForecast lat={location.lat} lon={location.lon} />
              </Grid>
              <Grid item xs={12} md={5}>
                <CurrentWeather lat={location.lat} lon={location.lon} />
              </Grid>
              <Grid item xs={12} md={7}>
                <AirPollution lat={location.lat} lon={location.lon} sx={{ height: '100%' }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ flex: 1 }}>
                  <FeelsLike lat={location.lat} lon={location.lon} />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ flex: 1 }}>
                  <Wind lat={location.lat} lon={location.lon} />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <FiveDayForecast lat={location.lat} lon={location.lon} />
              </Grid>
            </Grid>
          </Box>
        ) : (
          <Typography>{t('error_fetching_geolocation')}</Typography>
        )}
      </Box>
    </>
  );
};

export default Weather;
