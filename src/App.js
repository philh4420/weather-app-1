import React, { Suspense, useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { darkTheme, lightTheme } from './theme';
import Weather from './components/Weather';
import { useTranslation } from 'react-i18next';

const App = () => {
  const { i18n } = useTranslation();
  const [theme, setTheme] = useState(lightTheme);
  const [currentLanguage, setCurrentLanguage] = useState(localStorage.getItem('i18nextLng') || 'en');

  useEffect(() => {
    i18n.changeLanguage(currentLanguage);
  }, [currentLanguage, i18n]);

  const handleThemeChange = () => {
    setTheme((prevTheme) => (prevTheme === lightTheme ? darkTheme : lightTheme));
  };

  const handleLanguageChange = (language) => {
    setCurrentLanguage(language);
    localStorage.setItem('i18nextLng', language);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Weather
          theme={theme}
          handleThemeChange={handleThemeChange}
          handleLanguageChange={handleLanguageChange}
          currentLanguage={currentLanguage}
        />
      </ThemeProvider>
    </Suspense>
  );
};

export default App;
