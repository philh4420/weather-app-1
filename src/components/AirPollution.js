import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, CircularProgress, Grid, Tooltip, IconButton, useTheme
} from '@mui/material';
import {
  AcUnit as AcUnitIcon, BubbleChart as BubbleChartIcon, Opacity as OpacityIcon,
  FilterDrama as FilterDramaIcon, Whatshot as WhatshotIcon, LocalFireDepartment as LocalFireDepartmentIcon,
  History as HistoryIcon, Refresh as RefreshIcon
} from '@mui/icons-material';
import { alpha } from '@mui/system';
import { useTranslation } from 'react-i18next';
import { fetchAirPollutionData, fetchHistoricalAirPollutionData } from '../api/openWeatherMapAPI';
import InfoBox from './InfoBox2';

const AirPollution = ({ lat, lon }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [airPollutionData, setAirPollutionData] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAirPollutionData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const currentData = await fetchAirPollutionData(lat, lon);
      setAirPollutionData(currentData);
      const historical = await fetchHistoricalAirPollutionData(lat, lon);
      setHistoricalData(historical);
    } catch (error) {
      console.error('Error fetching air pollution data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [lat, lon]);

  useEffect(() => {
    getAirPollutionData();
  }, [getAirPollutionData]);

  const refreshData = () => {
    getAirPollutionData();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">{t('error_loading_air_pollution_data')}</Typography>;
  }

  if (!airPollutionData) {
    return <Typography>{t('no_air_pollution_data_available')}</Typography>;
  }

  const { list } = airPollutionData;
  const aqi = list[0]?.main?.aqi;
  const aqiLevels = [t('good'), t('fair'), t('moderate'), t('poor'), t('very_poor')];
  const pollutants = list[0]?.components;

  const healthAlerts = [
    { level: t('good'), message: t('health_alert_good') },
    { level: t('fair'), message: t('health_alert_fair') },
    { level: t('moderate'), message: t('health_alert_moderate') },
    { level: t('poor'), message: t('health_alert_poor') },
    { level: t('very_poor'), message: t('health_alert_very_poor') },
  ];

  const healthAlertDetails = [
    t('health_alert_good_detail'),
    t('health_alert_fair_detail'),
    t('health_alert_moderate_detail'),
    t('health_alert_poor_detail'),
    t('health_alert_very_poor_detail'),
  ];

  const pollutantSources = {
    co: t('pollutant_source_co'),
    no: t('pollutant_source_no'),
    no2: t('pollutant_source_no2'),
    o3: t('pollutant_source_o3'),
    so2: t('pollutant_source_so2'),
    pm2_5: t('pollutant_source_pm2_5'),
    pm10: t('pollutant_source_pm10'),
    nh3: t('pollutant_source_nh3'),
  };

  const currentAlert = healthAlerts[aqi - 1];

  const pollutantIcons = {
    co: <LocalFireDepartmentIcon />,
    no: <AcUnitIcon />,
    no2: <FilterDramaIcon />,
    o3: <BubbleChartIcon />,
    so2: <WhatshotIcon />,
    pm2_5: <OpacityIcon />,
    pm10: <OpacityIcon />,
    nh3: <BubbleChartIcon />,
  };

  const uniqueDates = new Map();
  historicalData.forEach((data) => {
    const date = new Date(data.dt * 1000).toLocaleDateString();
    if (!uniqueDates.has(date)) {
      uniqueDates.set(date, data);
    }
  });

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
          onClick={refreshData}
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
      <Typography variant="h5" gutterBottom sx={{ fontWeight: theme.typography.h5.fontWeight, textAlign: 'center', mb: theme.spacing(3) }}>
        {t('air_quality_index')}
      </Typography>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: theme.spacing(3), fontWeight: theme.typography.h4.fontWeight, color: aqiLevels[aqi - 1] === t('good') ? theme.palette.success.main : theme.palette.error.main }}>
        {aqiLevels[aqi - 1]}
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom sx={{ textAlign: 'center', mb: theme.spacing(2) }}>
        {currentAlert.message}
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom sx={{ textAlign: 'center', mb: theme.spacing(4) }}>
        {healthAlertDetails[aqi - 1]}
      </Typography>

      <Grid container spacing={2} justifyContent="center">
        {pollutants && Object.keys(pollutants).map((key, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <InfoBox
              icon={pollutantIcons[key]}
              label={t(key)}
              value={`${pollutants[key]} µg/m³`}
              description={pollutantSources[key]}
            />
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" gutterBottom sx={{ fontWeight: theme.typography.h6.fontWeight, textAlign: 'center', mt: theme.spacing(5) }}>
        {t('historical_air_quality')}
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        {Array.from(uniqueDates.values()).map((data, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <InfoBox
              icon={<HistoryIcon sx={{ fontSize: 40 }} />}
              label={t('date', { date: new Date(data.dt * 1000).toLocaleDateString() })}
              value={aqiLevels[data.main.aqi - 1]}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AirPollution;
