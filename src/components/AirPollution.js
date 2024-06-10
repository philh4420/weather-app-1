import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Card, CardContent, CircularProgress, Grid, Tooltip, IconButton, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { fetchAirPollutionData, fetchHistoricalAirPollutionData } from '../api/openWeatherMapAPI';
import InfoBox from './InfoBox';
import {
  AcUnit as AcUnitIcon,
  BubbleChart as BubbleChartIcon,
  Opacity as OpacityIcon,
  FilterDrama as FilterDramaIcon,
  Whatshot as WhatshotIcon,
  LocalFireDepartment as LocalFireDepartmentIcon,
  History as HistoryIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

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
  const aqiLevels = [
    t('good'),
    t('fair'),
    t('moderate'),
    t('poor'),
    t('very_poor'),
  ];
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
    <Card sx={{
      width: '100%',
      height: '100%',
      borderRadius: theme.shape.borderRadius,
      boxShadow: theme.shadows[4],
      position: 'relative',
      background: theme.palette.mode === 'dark' ? theme.palette.background.paper : 'linear-gradient(to right, #f7f8f9, #f1f2f3)',
    }}>
      <Tooltip title={t('refresh')} arrow>
        <IconButton
          onClick={refreshData}
          sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1, color: theme.palette.primary.main }}
        >
          <RefreshIcon />
        </IconButton>
      </Tooltip>
      <CardContent sx={{ padding: theme.spacing(2.5) }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: theme.typography.h5.fontWeight, textAlign: 'center', mb: theme.spacing(2) }}>
          {t('air_quality_index')}
        </Typography>
        <Typography variant="h4" color="textPrimary" gutterBottom sx={{ textAlign: 'center', mb: theme.spacing(2), fontWeight: theme.typography.h4.fontWeight, color: aqiLevels[aqi - 1] === t('good') ? '#4caf50' : '#f44336' }}>
          {aqiLevels[aqi - 1]}
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom sx={{ textAlign: 'center', mb: theme.spacing(2) }}>
          {currentAlert.message}
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom sx={{ textAlign: 'center', mb: theme.spacing(3) }}>
          {healthAlertDetails[aqi - 1]}
        </Typography>
        <Grid container spacing={theme.spacing(2)}>
          {pollutants && Object.keys(pollutants).map((key, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <InfoBox
                icon={pollutantIcons[key]}
                label={t(key)}
                value={`${pollutants[key]} µg/m³`}
                description={pollutantSources[key]}
              />
            </Grid>
          ))}
        </Grid>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: theme.typography.h6.fontWeight, textAlign: 'center', mt: theme.spacing(4) }}>
          {t('historical_air_quality')}
        </Typography>
        <Grid container spacing={theme.spacing(2)}>
          {Array.from(uniqueDates.values()).map((data, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <InfoBox
                icon={<HistoryIcon />}
                label={t('date', { date: new Date(data.dt * 1000).toLocaleDateString() })}
                value={aqiLevels[data.main.aqi - 1]}
              />
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default AirPollution;
