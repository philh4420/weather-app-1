import React from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';

const InfoBox = ({ icon, label, value }) => {
  const theme = useTheme();
  const isHighContrast = useMediaQuery('(prefers-contrast: high)');

  const boxStyles = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
    color: isHighContrast ? theme.palette.getContrastText(theme.palette.background.paper) : theme.palette.text.primary,
    boxShadow: theme.shadows[1],
    '&:hover': {
      boxShadow: theme.shadows[4],
    },
  };

  return (
    <Box sx={boxStyles}>
      {icon}
      <Typography variant="body1" sx={{ marginLeft: theme.spacing(1), fontWeight: 500 }}>
        {label}: {value}
      </Typography>
    </Box>
  );
};

export default InfoBox;
