import React, { useEffect, useState, useCallback } from 'react';
import { Box, Typography, useTheme, IconButton, Tooltip, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import axios from 'axios';
import NavigationIcon from '@mui/icons-material/Navigation';
import InfoBox from './InfoBox';
import compassSvg from '../weather-icons/compass.svg';
import { useTranslation } from 'react-i18next';

const API_KEY = process.env.REACT_APP_OPENWEATHERMAP_API_KEY;

const WindContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  width: '100%',
  maxWidth: '500px',
  position: 'relative',
  '&:hover': {
    boxShadow: theme.shadows[6],
  },
}));

const CompassContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  position: 'relative',
  width: '200px',
  height: '200px',
  marginBottom: theme.spacing(2),
  borderRadius: '50%',
  boxShadow: theme.shadows[2],
}));

const CompassIcon = styled('img')(({ theme }) => ({
  width: '100px',
  height: '100px',
  marginBottom: theme.spacing(2),
}));

const CompassPoints = styled('div')(({ theme }) => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '14px',
  fontWeight: 'bold',
  color: theme.palette.text.primary,
  pointerEvents: 'none',
  '& div': {
    position: 'absolute',
  },
  '& .N': { top: '5%', left: '50%', transform: 'translateX(-50%)', color: theme.palette.primary.main },
  '& .NE': { top: '20%', left: '80%', transform: 'translate(-50%, -50%)' },
  '& .E': { top: '50%', left: '90%', transform: 'translateY(-50%)', color: theme.palette.primary.main },
  '& .SE': { top: '80%', left: '80%', transform: 'translate(-50%, -50%)' },
  '& .S': { bottom: '5%', left: '50%', transform: 'translateX(-50%)', color: theme.palette.primary.main },
  '& .SW': { bottom: '10%', left: '20%', transform: 'translate(-50%, -50%)' },
  '& .W': { top: '50%', left: '5%', transform: 'translateY(-50%)', color: theme.palette.primary.main },
  '& .NW': { top: '20%', left: '20%', transform: 'translate(-50%, -50%)' },
}));

const DirectionNeedle = styled('div')(({ theme, direction }) => ({
  position: 'absolute',
  top: '55%',
  left: '53%',
  width: '0',
  height: '0',
  borderLeft: '10px solid transparent',
  borderRight: '10px solid transparent',
  borderBottom: `60px solid ${theme.palette.primary.main}`,
  transformOrigin: 'top center',
  transform: `rotate(${direction}deg) translate(-50%, -100%)`,
  transition: 'transform 0.3s ease-in-out',
  zIndex: 1,
}));

const WindSpeedBar = styled(Box)(({ theme, speed }) => ({
  width: '100%',
  height: '12px',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.grey[300],
  marginTop: theme.spacing(2),
  overflow: 'hidden',
  '&::after': {
    content: '""',
    display: 'block',
    width: `${speed}%`,
    height: '100%',
    backgroundColor: theme.palette.primary.main,
    transition: 'width 0.3s ease-in-out',
  },
}));

const Wind = ({ lat, lon }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [windData, setWindData] = useState({ speed: 0, direction: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWindData = useCallback(async () => {
    try {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
      const response = await axios.get(weatherUrl);
      const { speed, deg } = response.data.wind;
      setWindData({ speed, direction: deg });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching wind data:', error);
      setError(t('error_fetching_wind_data'));
      setLoading(false);
    }
  }, [lat, lon, t]);

  useEffect(() => {
    fetchWindData();
  }, [fetchWindData]);

  const handleRefreshClick = () => {
    setLoading(true); // Show loading state
    fetchWindData();
  };

  const speedPercentage = (windData.speed / 50) * 100; // Assuming 50 km/h is a realistic maximum for scaling

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <WindContainer>
      <Tooltip title={t('refresh')} arrow>
        <IconButton
          onClick={handleRefreshClick}
          sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1, color: theme.palette.primary.main }}
        >
          <RefreshIcon />
        </IconButton>
      </Tooltip>
      <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.text.primary, marginTop: theme.spacing(2) }}>
        {t('wind_speed')}
      </Typography>
      <CompassIcon src={compassSvg} alt={t('compass')} />
      <CompassContainer>
        <CompassPoints>
          <div className="N">{t('north')}</div>
          <div className="NE">{t('northeast')}</div>
          <div className="E">{t('east')}</div>
          <div className="SE">{t('southeast')}</div>
          <div className="S">{t('south')}</div>
          <div className="SW">{t('southwest')}</div>
          <div className="W">{t('west')}</div>
          <div className="NW">{t('northwest')}</div>
        </CompassPoints>
        <DirectionNeedle theme={theme} direction={windData.direction} />
      </CompassContainer>
      <WindSpeedBar theme={theme} speed={speedPercentage} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: theme.spacing(2) }}>
        <InfoBox icon={<NavigationIcon />} label={t('speed')} value={`${windData.speed} km/h`} />
        <InfoBox icon={<NavigationIcon />} label={t('direction')} value={`${windData.direction}°`} />
      </Box>
    </WindContainer>
  );
};

export default Wind;
