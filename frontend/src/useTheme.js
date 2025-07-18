// hooks/useTheme.js

import { useEffect, useState } from 'react';

export const useTheme = () => {
  // Function to get system theme preference
  const getSystemTheme = () => {
    // Check if browser supports matchMedia
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const systemPrefersDark = mediaQuery.matches;
      const detectedTheme = systemPrefersDark ? 'dark' : 'light';

      console.log('System/browser theme detection:');
      console.log('- matchMedia supported:', true);
      console.log('- prefers-color-scheme: dark =', systemPrefersDark);
      console.log('- detected system theme:', detectedTheme);

      return detectedTheme;
    }

    // Fallback to light if matchMedia is not supported
    console.log('System/browser theme detection:');
    console.log('- matchMedia supported:', false);
    console.log('- falling back to light theme');
    return 'light';
  };

  // Get initial theme with priority: localStorage > system preference > light default
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('app-theme');

    if (savedTheme) {
      // User has a saved preference, use it
      console.log('Found saved theme preference:', savedTheme);
      return savedTheme;
    }

    // No saved preference, check system theme
    console.log('No saved theme found, checking system preference...');
    const systemTheme = getSystemTheme();
    console.log('Using system theme:', systemTheme);

    // Default to light if system detection fails or returns unexpected value
    return systemTheme === 'dark' ? 'dark' : 'light';
  });

  // Apply theme to document body whenever theme changes
  useEffect(() => {
    // Set the data-theme attribute on body
    document.body.setAttribute('data-theme', theme);

    // Save to localStorage only when user manually changes theme
    // (not on initial system detection)
    localStorage.setItem('app-theme', theme);

    // Optional: Also set on html element for broader CSS targeting
    document.documentElement.setAttribute('data-theme', theme);

    console.log('Applied theme:', theme);
  }, [theme]);

  // Function to toggle between themes (marks as manual preference)
  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === 'dark' ? 'light' : 'dark';
      // Mark as manual preference so system changes don't override
      localStorage.setItem('app-theme-manual', 'true');
      return newTheme;
    });
  };

  // Function to set specific theme (marks as manual preference)
  const setSpecificTheme = (newTheme) => {
    if (newTheme === 'dark' || newTheme === 'light') {
      setTheme(newTheme);
      // Mark as manual preference
      localStorage.setItem('app-theme-manual', 'true');
    }
  };

  // Function to follow system theme (removes manual preference flag)
  const setSystemTheme = () => {
    const systemTheme = getSystemTheme();
    setTheme(systemTheme);
    // Remove manual preference flag so system changes are respected
    localStorage.removeItem('app-theme-manual');
    console.log('Switched to system theme:', systemTheme);
  };

  // Function to reset to light theme default
  const resetToDefault = () => {
    setTheme('light');
    localStorage.removeItem('app-theme');
    localStorage.removeItem('app-theme-manual');
    console.log('Reset to default light theme');
  };

  // Listen for system theme changes
  useEffect(() => {
    // Only set up listener if browser supports it
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleSystemThemeChange = (e) => {
      // Only auto-change if user hasn't manually set a preference
      const hasManualPreference = localStorage.getItem('app-theme-manual');

      if (!hasManualPreference) {
        const newSystemTheme = e.matches ? 'dark' : 'light';
        console.log('System theme changed to:', newSystemTheme);
        setTheme(newSystemTheme);
      } else {
        console.log(
          'System theme changed but user has manual preference, not switching'
        );
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
    resetToDefault,
    getSystemTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    isFollowingSystem: !localStorage.getItem('app-theme-manual'),
  };
};
