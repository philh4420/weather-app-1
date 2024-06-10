import { createTheme } from '@mui/material/styles';

// Common settings for all themes
const commonSettings = {
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
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
  // shape: {
  //   borderRadius: 16,
  // },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          textTransform: 'none',
          padding: '12px 24px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
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
      main: '#bb86fc',
    },
    secondary: {
      main: '#03dac6',
    },
    background: {
      default: '#121212',
      paper: '#1d1d1d',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0bec5',
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
          backgroundColor: '#1d1d1d',
          '&:focus': {
            backgroundColor: '#1d1d1d',
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          backgroundColor: '#1d1d1d',
          '&:hover': {
            backgroundColor: '#333',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
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
      main: '#1e88e5',
    },
    secondary: {
      main: '#e53935',
    },
    background: {
      default: '#ffffff',
      paper: '#f5f5f5',
    },
    text: {
      primary: '#000000',
      secondary: '#757575',
    },
    scrollbar: {
      thumb: '#1e88e5',
      thumbHover: '#555',
    },
  },
  components: {
    MuiSelect: {
      styleOverrides: {
        select: {
          backgroundColor: '#f5f5f5',
          '&:focus': {
            backgroundColor: '#f5f5f5',
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          backgroundColor: '#f5f5f5',
          '&:hover': {
            backgroundColor: '#e0e0e0',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

export { darkTheme, lightTheme };
