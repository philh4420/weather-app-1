import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, useTheme } from '@mui/material';

const InfoBox = ({ icon, label, value }) => {
  const theme = useTheme();

  const boxStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    background: `linear-gradient(135deg, ${theme.palette.primary.light} 30%, ${theme.palette.primary.main} 90%)`,
    color: theme.palette.getContrastText(theme.palette.primary.main),
    boxShadow: theme.shadows[3],
    transition: 'box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out',
    minWidth: '220px', // Set a fixed width
    minHeight: '75px', // Set a minimum height
    '&:hover': {
      boxShadow: theme.shadows[10],
      transform: 'scale(1.05)',
    },
    '&:focus': {
      boxShadow: theme.shadows[10],
      transform: 'scale(1.05)',
      outline: `2px solid ${theme.palette.secondary.main}`,
    },
  };

  return (
    <Box sx={boxStyles} tabIndex={0} role="group" aria-label={label}>
      {icon}
      <Typography variant="body1" sx={{ fontWeight: 600, marginTop: theme.spacing(1), textAlign: 'center' }}>
        {label}
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 700, marginTop: theme.spacing(0.5), textAlign: 'center' }}>
        {value}
      </Typography>
    </Box>
  );
};

InfoBox.propTypes = {
  icon: PropTypes.element.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
};

export default InfoBox;
