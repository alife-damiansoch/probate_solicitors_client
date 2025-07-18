// hooks/useTheme.js

import { useEffect, useState } from 'react';

export const useTheme = () => {
  // Get initial theme from localStorage or default to 'dark'
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('app-theme');
    return savedTheme || 'dark';
  });

  // Apply theme to document body whenever theme changes
  useEffect(() => {
    // Set the data-theme attribute on body
    document.body.setAttribute('data-theme', theme);

    // Save to localStorage
    localStorage.setItem('app-theme', theme);

    // Optional: Also set on html element for broader CSS targeting
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Function to toggle between themes
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  // Function to set specific theme
  const setSpecificTheme = (newTheme) => {
    if (newTheme === 'dark' || newTheme === 'light') {
      setTheme(newTheme);
    }
  };

  // Function to set theme based on system preference
  const setSystemTheme = () => {
    const systemPrefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    const systemTheme = systemPrefersDark ? 'dark' : 'light';
    setTheme(systemTheme);
  };

  // Listen for system theme changes (optional)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleSystemThemeChange = (e) => {
      // Only auto-change if user hasn't manually set a preference
      const hasManualPreference = localStorage.getItem('app-theme-manual');
      if (!hasManualPreference) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

  return {
    theme,
    toggleTheme,
    setTheme: setSpecificTheme,
    setSystemTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
  };
};
