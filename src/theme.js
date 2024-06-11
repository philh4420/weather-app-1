import { createTheme } from '@mui/material/styles';

// Common settings for all themes
const commonSettings = {
  typography: {
    fontFamily: "'San Francisco', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontSize: '2.75rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.01562em',
    },
    h2: {
      fontSize: '2.25rem',
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.00833em',
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.4,
      letterSpacing: '0em',
    },
    body1: {
      fontSize: '1.125rem',
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: '0.00938em',
    },
    body2: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0.01071em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          textTransform: 'none',
          padding: '12px 24px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0 6px 18px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0 6px 18px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '24px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: 'inherit',
          padding: '24px',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h6: {
          marginBottom: '16px',
        },
        body2: {
          color: '#6c757d',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          backgroundColor: 'inherit',
          '&:focus': {
            backgroundColor: 'inherit',
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          backgroundColor: 'inherit',
          '&:hover': {
            backgroundColor: '#f5f5f5',
          },
        },
      },
    },
  },
};

// Dark mode theme
const darkTheme = createTheme({
  ...commonSettings,
  palette: {
    mode: 'dark',
    primary: {
      main: '#0a84ff',
    },
    secondary: {
      main: '#ff375f',
    },
    background: {
      default: '#1c1c1e',
      paper: '#2c2c2e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b5',
    },
    scrollbar: {
      thumb: '#888',
      thumbHover: '#555',
    },
  },
  components: {
    MuiSelect: {
      styleOverrides: {
        select: {
          backgroundColor: '#2c2c2e',
          '&:focus': {
            backgroundColor: '#2c2c2e',
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          backgroundColor: '#2c2c2e',
          '&:hover': {
            backgroundColor: '#3a3a3c',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0 6px 18px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
  },
});

// Light mode theme
const lightTheme = createTheme({
  ...commonSettings,
  palette: {
    mode: 'light',
    primary: {
      main: '#007aff',
    },
    secondary: {
      main: '#ff3b30',
    },
    background: {
      default: '#f0f0f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#1c1c1e',
      secondary: '#2c2c2e',
    },
    scrollbar: {
      thumb: '#007aff',
      thumbHover: '#555',
    },
  },
  components: {
    MuiSelect: {
      styleOverrides: {
        select: {
          backgroundColor: '#ffffff',
          '&:focus': {
            backgroundColor: '#ffffff',
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          '&:hover': {
            backgroundColor: '#e5e5ea',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0 6px 18px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
  },
});

export { darkTheme, lightTheme };
