import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const getSystemTheme = () => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'system'; // По умолчанию 'system'
  });

  const applyTheme = (currentTheme) => {
    const themeToApply = currentTheme === 'system' ? getSystemTheme() : currentTheme;
    return themeToApply; // Возвращаем тему для использования в App
  };

  useEffect(() => {
    localStorage.setItem('theme', theme);

    if (theme === 'system') {
      const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme('system');
      darkModeMediaQuery.addEventListener('change', handleChange);

      return () => darkModeMediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  const appliedTheme = applyTheme(theme);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, appliedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
